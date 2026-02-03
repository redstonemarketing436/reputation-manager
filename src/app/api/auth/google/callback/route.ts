import { NextRequest, NextResponse } from 'next/server';
import { handleAuthCallbackAction } from '@/app/actions/gbp-auth';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        console.error('Google Auth Error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?auth_error=${error}`);
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        await handleAuthCallbackAction(code);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?auth_success=true`);
    } catch (err) {
        console.error('Failed to handle Google Auth Callback:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?auth_error=callback_failed`);
    }
}
