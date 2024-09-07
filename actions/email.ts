"use server";

import { sendParentalConsentEmail } from "@/lib/emailService";

export async function sendConsentEmail(parentEmail: string, userId: string) {
  try {
    await sendParentalConsentEmail(parentEmail, userId);
    return { success: true, message: "Consent email sent successfully" };
  } catch (error) {
    console.error("Error sending consent email:", error);
    return { success: false, message: "Failed to send consent email" };
  }
}
