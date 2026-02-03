/**
 * This script helps you generate a Google OAuth 2.0 Refresh Token.
 * 
 * Usage:
 * 1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env.local
 * 2. Run: npx ts-node scripts/get-refresh-token.ts
 */

const { google } = require('googleapis');
const readline = require('readline');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000' // Ensure this is in your Google Cloud Console "Redirect URIs"
);

const scopes = [
    'https://www.googleapis.com/auth/business.manage',
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Forces refresh token to be returned
});

console.log('1. Open this URL in your browser:\n', url);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('2. Enter the "code" parameter from the URL after you login: ', async (code: string) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        console.log('\n3. Your Refresh Token is:\n', tokens.refresh_token);
        console.log('\nAdd this to your .env.local file as GOOGLE_REFRESH_TOKEN');
    } catch (error) {
        console.error('Error retrieving access token', error);
    }
    rl.close();
});
