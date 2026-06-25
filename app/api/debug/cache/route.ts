import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/content'; // Importez votre fonction mise en cache

export async function GET() {
    try {
        const content = await getSiteContent();

        return NextResponse.json({
            status: "success",
            timestamp: new Date().toISOString(),
            contentSample: content ? Object.keys(content) : null,
            fullContent: content
        });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
