import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/services/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { status, resident } = body;

        console.log(`[WEBHOOK] Received Entrata event: ${status}`);

        if (status === 'Move-In' || status === 'Move-Out') {
            const surveyToken = Buffer.from(`${resident.email}-${Date.now()}`).toString('base64');
            const surveyLink = `http://localhost:3000/survey?token=${surveyToken}`;

            await EmailService.sendSurveyEmail(resident.email, surveyLink, status);

            return NextResponse.json({ message: 'Survey workflow triggered' }, { status: 200 });
        }

        return NextResponse.json({ message: 'Event ignored' }, { status: 200 });

    } catch (error) {
        console.error('Webhook processing failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
