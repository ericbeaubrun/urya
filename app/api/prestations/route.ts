import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase_client';
import {Resend} from "resend"
import {clientEmailTemplate} from "@/app/emails/userEmail";
import {adminEmailTemplate} from "@/app/emails/adminEmail";
import {enforceRateLimit} from "@/lib/rate-limit";
import {isValidEmail, normalizeField, MAX_LONG_FIELD} from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {

    const limited = enforceRateLimit(req, "prestations", {
        limit: 5,
        windowMs: 60 * 60 * 1000,
    });
    if (limited) return limited;

    try {
        const body = await req.json();

        const nom = normalizeField(body?.nom);
        const mail = normalizeField(body?.mail);
        const tel = normalizeField(body?.tel);
        const date_debut = normalizeField(body?.date_debut);
        const date_fin = normalizeField(body?.date_fin);
        const heure_debut = normalizeField(body?.heure_debut);
        const heure_fin = normalizeField(body?.heure_fin);
        const type = normalizeField(body?.type);
        const lieu = normalizeField(body?.lieu);
        const notes = normalizeField(body?.notes, MAX_LONG_FIELD);

        if (!nom || !mail || !date_debut) {
            return NextResponse.json(
                {error: 'Les champs nom, email et date de début sont obligatoires.'},
                {status: 400}
            );
        }

        if (!isValidEmail(mail)) {
            return NextResponse.json(
                {error: 'Format d\'email invalide.'},
                {status: 400}
            );
        }


        let clientId: string;
        const {data: existingClient, error: clientCheckError} = await supabaseAdmin()
            .from('clients')
            .select('id')
            .eq('mail', mail)
            .single();

        if (clientCheckError && clientCheckError.code !== 'PGRST116') {
            console.error('Erreur lors de la vérification du client:', clientCheckError);
            return NextResponse.json(
                {error: 'Erreur lors de la vérification du client.'},
                {status: 500}
            );
        }

        if (existingClient) {
            clientId = existingClient.id;

            const {error: updateError} = await supabaseAdmin()
                .from('clients')
                .update({
                    nom,
                    tel: tel || null
                })
                .eq('id', clientId);

            if (updateError) {
                console.error('Erreur lors de la mise à jour du client:', updateError);
                return NextResponse.json(
                    {error: 'Erreur lors de la mise à jour du client.'},
                    {status: 500}
                );
            }
        } else {
            const {data: newClient, error: clientError} = await supabaseAdmin()
                .from('clients')
                .insert({
                    nom,
                    mail,
                    tel: tel || null
                })
                .select('id')
                .single();

            if (clientError) {
                console.error('Erreur lors de la création du client:', clientError);
                return NextResponse.json(
                    {error: 'Erreur lors de la création du client.'},
                    {status: 500}
                );
            }

            clientId = newClient.id;
        }

        // Définition d'un type explicite pour les données d'insertion de prestation
        interface PrestationInsert {
            id_client: string;
            statut: string;
            date_debut: string;
            date_fin: string | null;
            heure_debut: string | null;
            heure_fin: string | null;
            type: string | null;
            lieu: string | null;
            notes: string | null;
        }

        const prestationData: PrestationInsert = {
            id_client: clientId,
            statut: 'en_attente',
            date_debut,
            date_fin: date_fin || null,
            heure_debut: heure_debut || null,
            heure_fin: heure_fin || null,
            type: type || null,
            lieu: lieu || null,
            notes: notes || null
        };

        const {error: prestationError} = await supabaseAdmin()
            .from('prestations')
            .insert(prestationData);

        if (prestationError) {
            console.error('Erreur lors de la création de la prestation:', prestationError);
            return NextResponse.json(
                {error: 'Erreur lors de la création de la prestation.'},
                {status: 500}
            );
        }


        // On repart des champs normalisés, jamais du body brut.
        const record = {
            nom, mail, tel, date_debut, date_fin,
            heure_debut, heure_fin, type, lieu, notes
        };

        const userHtml = clientEmailTemplate(record)
        const adminHtml = adminEmailTemplate(record)

        await resend.emails.send({
            from: process.env.RESEND_MAIL_ADDRESS!,
            to: mail,
            subject: userHtml.subject,
            html: userHtml.html,
        })

        await resend.emails.send({
            from: process.env.RESEND_MAIL_ADDRESS!,
            to: process.env.ADMIN_EMAIL!,
            subject: adminHtml.subject,
            html: adminHtml.html,
        })

        return NextResponse.json({message: "OK"}, {status: 201})

    } catch (err) {
        console.error(err)
        return NextResponse.json(
            {error: 'Erreur interne du serveur.'},
            {status: 500}
        )
    }
}
