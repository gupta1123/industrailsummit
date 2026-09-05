"use server";

import type { RegistrationValues } from "@/lib/summit/validation";

export type WaitlistRegistrationState = {
  success?: boolean;
  message?: string;
  errors?: Partial<Record<keyof RegistrationValues, string[]>>;
  values?: Partial<RegistrationValues>;
};

const REGISTRATIONS_CLOSED_MESSAGE =
  "Industrial Summit registrations are now closed. We are not accepting new registration or waitlist submissions.";

export async function submitWaitlistRegistration(): Promise<WaitlistRegistrationState> {
  return { message: REGISTRATIONS_CLOSED_MESSAGE };
}
