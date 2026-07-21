import {NextRequest, NextResponse} from "next/server";
import {Resend} from "resend";
import {contactEmailTemplate} from "@/app/emails/contactEmail";
import {enforceRateLimit} from "@/lib/rate-limit";
import {isValidEmail, normalizeField, MAX_LONG_FIELD} from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
    const limited = enforceRateLimit(req, "contact", {
        limit: 5,
        windowMs: 60 * 60 * 1000,
    });
    if (limited) return limited;

    try {
        const data = await req.json();

        const nom = normalizeField(data?.nom);
        const email = normalizeField(data?.email);
        const message = normalizeField(data?.message, MAX_LONG_FIELD);

        if (!nom || !email || !message) {
            return NextResponse.json({error: "Champs manquants"}, {status: 400});
        }

        if (!isValidEmail(email)) {
            return NextResponse.json({error: "Format d'email invalide."}, {status: 400});
        }

        const emailTemplate = contactEmailTemplate({nom, email, message});

        await resend.emails.send({
            from: process.env.RESEND_MAIL_ADDRESS!,
            to: process.env.ADMIN_EMAIL!,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });

        return NextResponse.json({ok: true});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Erreur serveur"}, {status: 500});
    }
}
