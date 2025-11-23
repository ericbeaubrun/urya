import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import {contactEmailTemplate} from "@/app/emails/contactEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
    try {

        const data = await req.json()
        const {nom, email, message} = data;

        if (!nom || !email || !message) {
            return NextResponse.json({error: "Champs manquants"}, {status: 400});
        }

        const emailTemplate: { subject: string, html: string } = contactEmailTemplate(data);

        const result = await resend.emails.send({
            // from: "onboarding@resend.dev",
            // from: process.env.RESEND_MAIL_ADDRESS,
            from: process.env.ressend_mail_address!,
            to: process.env.admin_email!,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        console.log("EMAIL RESULT:", result);

        return NextResponse.json({ok: true});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}
