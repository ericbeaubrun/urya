import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import {appointmentEmailTemplate, appointmentConfirmationEmailTemplate} from "@/app/emails/appointmentEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const {name, contact, availability} = data;

        if (!name || !contact || !availability) {
            return NextResponse.json({error: "Champs manquants"}, {status: 400});
        }

        const emailTemplate = appointmentEmailTemplate(data);

        const result = await resend.emails.send({
            from: process.env.RESEND_MAIL_ADDRESS!,
            to: process.env.ADMIN_EMAIL!,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        if (contact && contact.includes('@')) {
            try {
                const confirmationTemplate = appointmentConfirmationEmailTemplate(data);
                await resend.emails.send({
                    from: process.env.RESEND_MAIL_ADDRESS!,
                    to: contact,
                    subject: confirmationTemplate.subject,
                    html: confirmationTemplate.html,
                });
            } catch (e) {
                console.error("Erreur lors de l'envoi du mail de confirmation client:", e);
            }
        }

        console.log("APPOINTMENT EMAIL RESULT:", result);

        return NextResponse.json({ok: true});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}
