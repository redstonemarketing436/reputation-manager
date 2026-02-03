export const EmailService = {
    async sendSurveyEmail(residentEmail: string, surveyLink: string, type: 'Move-In' | 'Move-Out'): Promise<void> {
        console.log(`\n--- [MOCK EMAIL SERVICE] ---`);
        console.log(`To: ${residentEmail}`);
        console.log(`Subject: How was your ${type}?`);
        console.log(`Body:`);
        console.log(`> Hi there!`);
        console.log(`> Please delete a moment to tell us about your ${type} experience.`);
        console.log(`> Click here to take the survey: ${surveyLink}`);
        console.log(`----------------------------\n`);
    }
};
