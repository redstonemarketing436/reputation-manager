"use server";

import { google } from 'googleapis';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';

/**
 * Generates the Google OAuth2 authorization URL.
 */
export async function getAuthUrlAction() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
        throw new Error('Google OAuth credentials not configured.');
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    const scopes = [
        'https://www.googleapis.com/auth/business.manage'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent' // Force refresh token
    });

    return redirect(url);
}

/**
 * Handles the OAuth2 callback by exchanging the code for tokens.
 */
export async function handleAuthCallbackAction(code: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Save tokens to Firestore
        await setDoc(doc(db, 'settings', 'gbp_auth'), {
            ...tokens,
            updatedAt: new Date().toISOString()
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to handle auth callback:', error);
        throw new Error('Authentication failed');
    }
}
