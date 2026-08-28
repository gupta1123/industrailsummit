"use server";

import {
  summitRegistrationSchema,
  type RegistrationValues,
} from "@/lib/summit/validation";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export type WaitlistRegistrationState = {
  success?: boolean;
  message?: string;
  errors?: Partial<Record<keyof RegistrationValues, string[]>>;
  values?: Partial<RegistrationValues>;
};

function formValue(formData: FormData, name: string) {
  const input = formData.get(name);
  return typeof input === "string" ? input : "";
}

export async function submitWaitlistRegistration(
  _previousState: WaitlistRegistrationState,
  formData: FormData,
): Promise<WaitlistRegistrationState> {
  const submittedValues = {
    first_name: formValue(formData, "first_name"),
    last_name: formValue(formData, "last_name"),
    phone: formValue(formData, "phone"),
    email: formValue(formData, "email"),
    industry: formValue(formData, "industry"),
    industry_other: formValue(formData, "industry_other"),
    profession: formValue(formData, "profession"),
    designation: formValue(formData, "designation"),
    place: formValue(formData, "place"),
    participation_purpose: formValue(formData, "participation_purpose"),
    meeting_requests: [],
    summit_expectations: formValue(formData, "summit_expectations"),
    website: formValue(formData, "website"),
  };

  const parsed = summitRegistrationSchema.safeParse(submittedValues);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      message: "Please check the highlighted fields.",
      errors: {
        first_name: fieldErrors.first_name,
        last_name: fieldErrors.last_name,
        phone: fieldErrors.phone,
        email: fieldErrors.email,
        industry: fieldErrors.industry,
        industry_other: fieldErrors.industry_other,
        profession: fieldErrors.profession,
        designation: fieldErrors.designation,
        place: fieldErrors.place,
        participation_purpose: fieldErrors.participation_purpose,
        summit_expectations: fieldErrors.summit_expectations,
      },
      values: submittedValues,
    };
  }

  const values: RegistrationValues = {
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    industry: parsed.data.industry,
    industry_other: parsed.data.industry_other,
    profession: parsed.data.profession,
    designation: parsed.data.designation,
    place: parsed.data.place,
    participation_purpose: parsed.data.participation_purpose,
    meeting_requests: [],
    summit_expectations: parsed.data.summit_expectations,
  };

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase
      .from("summit_waitlist_registrations")
      .insert({
        registration_type: "individual",
        company_name: null,
        attendee_count: 1,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        email: values.email.toLowerCase(),
        industry:
          values.industry === "Other" ? values.industry_other : values.industry,
        profession: values.profession,
        designation: values.designation,
        place: values.place,
        participation_purpose: values.participation_purpose,
        meeting_requests: [],
        summit_expectations: values.summit_expectations || null,
      });

    if (error) {
      console.error("Unable to save waitlist registration:", error);
      return {
        message: "We could not save your details. Please try again.",
        values,
      };
    }
  } catch (err: unknown) {
    console.error("Error connecting to Supabase or saving waitlist:", err);
    return {
      message: "We could not save your details. Please try again.",
      values,
    };
  }

  return { success: true };
}
