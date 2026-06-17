import {NextRequest, NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/mongodb';
import {ObjectId} from 'mongodb';
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

        if (!nom || !mail || !date_debut) {
            return NextResponse.json(
                {error: 'Les champs nom, email et date de début sont obligatoires.'},
                {status: 400}
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail)) {
            return NextResponse.json(
                {error: 'Format d\'email invalide.'},
                {status: 400}
            );
        }

        const {db} = await connectToDatabase();

        let clientId: ObjectId;
        const existingClient = await db.collection('clients').findOne({ mail });

        if (existingClient) {
            clientId = existingClient._id;

            await db.collection('clients').updateOne(
                { _id: clientId },
                {
                    $set: {
                        nom,
                        tel: tel || null
                    }
                }
            );
        } else {
            const result = await db.collection('clients').insertOne({
                nom,
                mail,
                tel: tel || null
            });
            clientId = result.insertedId;
        }

        const prestationData = {
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

        const resultPrestation = await db.collection('prestations').insertOne(prestationData);

        if (!resultPrestation.insertedId) {
            return NextResponse.json(
                {error: 'Erreur lors de la création de la prestation.'},
                {status: 500}
            );
        }


        const userHtml = clientEmailTemplate(body)
        const adminHtml = adminEmailTemplate(body)
        console.log(userHtml);
        console.log(adminHtml);

        await resend.emails.send({
            // from: "onboarding@resend.dev",
            from: process.env.RESEND_MAIL_ADDRESS!,
            to: mail,
            subject: userHtml.subject,
            html: userHtml.html,
        })

        await resend.emails.send({
            // from: "onboarding@resend.dev",
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
