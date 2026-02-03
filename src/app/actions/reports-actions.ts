"use server";

import { SurveyService } from "@/lib/services/survey-service";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function getSurveyAnalyticsAction(propertyId: string, startDateStr: string, endDateStr: string) {
    try {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        return await SurveyService.getAnalytics(propertyId, start, end);
    } catch (error) {
        console.error("Action error in getSurveyAnalyticsAction:", error);
        throw error;
    }
}

export async function scheduleReportAction(email: string, frequency: string, propertyId: string) {
    try {
        const schedulesRef = collection(db, 'report_schedules');
        await addDoc(schedulesRef, {
            email,
            frequency,
            propertyId,
            createdAt: serverTimestamp(),
            status: 'ACTIVE'
        });
        return { success: true };
    } catch (error) {
        console.error("Action error in scheduleReportAction:", error);
        throw error;
    }
}
