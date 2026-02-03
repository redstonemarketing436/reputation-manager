/**
 * Generates a unique survey link for a resident, including property context.
 */
export function generateSurveyLink(propertyId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reputation.redstonemarketing.com';
    // Append propertyId and a nonce/ID for tracking (mocked here as timestamp)
    return `${baseUrl}/survey?propertyId=${propertyId}&t=${Date.now()}`;
}
