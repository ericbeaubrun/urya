import {NextRequest, NextResponse} from 'next/server';
import {supabaseAdmin} from '@/lib/supabase_client';
import {Resend} from "resend"
import {clientEmailTemplate} from "@/app/emails/userEmail";
import {adminEmailTemplate} from "@/app/emails/adminEmail";

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {


    try {
        const body = await req.json();

        const {
            nom,
            mail,
            tel,
            date_debut,
            date_fin,
            heure_debut,
            heure_fin,
            type,
            lieu,
            notes
        } = body;

        // Validation des champs obligatoires
        if (!nom || !mail || !date_debut) {
            return NextResponse.json(
                {error: 'Les champs nom, email et date de début sont obligatoires.'},
                {status: 400}
            );
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail)) {
            return NextResponse.json(
                {error: 'Format d\'email invalide.'},
                {status: 400}
            );
        }


        // Vérifier si le client existe déjà
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
            // Client existe déjà, utiliser son ID
            clientId = existingClient.id;

            // Mettre à jour les informations du client si nécessaire
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
            // Créer un nouveau client
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

        // Préparer les données de la prestation
        const prestationData: any = {
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

        // Créer la prestation
        const {data: prestation, error: prestationError} = await supabaseAdmin()
            .from('prestations')
            .insert(prestationData)
            .select()
            .single();

        if (prestationError) {
            console.error('Erreur lors de la création de la prestation:', prestationError);
            return NextResponse.json(
                {error: 'Erreur lors de la création de la prestation.'},
                {status: 500}
            );
        }


        const userHtml = clientEmailTemplate(body)
        const adminHtml = adminEmailTemplate(body)
        console.log(userHtml);
        console.log(adminHtml);


        const userEmail = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: mail,
            subject: userHtml.subject,
            html: userHtml.html,
        })

        const adminEmail = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: process.env.admin_email!,
            subject: adminHtml.subject,
            html: adminHtml.html,
        })

        return NextResponse.json({message: "OK"}, {status: 201})

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {error: 'Erreur interne du serveur.'},
            {status: 500}
        )
    }
}
