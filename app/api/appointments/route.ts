import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import {appointmentEmailTemplate, appointmentConfirmationEmailTemplate} from "@/app/emails/appointmentEmail";
import {enforceRateLimit} from "@/lib/rate-limit";
import {isValidEmail, normalizeField, MAX_LONG_FIELD} from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
    const limited = enforceRateLimit(req, "appointments", {
        limit: 3,
        windowMs: 60 * 60 * 1000,
    });
    if (limited) return limited;

    try {
        const data = await req.json();

        const name = normalizeField(data?.name);
        const contact = normalizeField(data?.contact);
        const availability = normalizeField(data?.availability, MAX_LONG_FIELD);
        const type = normalizeField(data?.type);

        if (!name || !contact || !availability) {
            return NextResponse.json({error: "Champs manquants"}, {status: 400});
        }

        const record = {name, contact, availability, type};
        const emailTemplate = appointmentEmailTemplate(record);

        await resend.emails.send({
            from: process.env.RESEND_MAIL_ADDRESS!,
            to: process.env.ADMIN_EMAIL!,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        // Le champ `contact` accepte un email OU un téléphone. On n'envoie la
        // confirmation que si c'est un email strictement valide : cette adresse
        // est fournie par le visiteur, c'est le seul endroit du site où un tiers
        // choisit le destinataire d'un envoi.
        if (isValidEmail(contact)) {
            try {
                const confirmationTemplate = appointmentConfirmationEmailTemplate(record);
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

        return NextResponse.json({ok: true});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}
