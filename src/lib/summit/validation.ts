import { z } from "zod";

import { SECTOR_OPTIONS } from "@/lib/summit/preferences";

const requiredText = (label: string, maximum = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maximum, `${label} must be ${maximum} characters or fewer.`);

const phoneNumber = z
  .string()
  .trim()
  .superRefine((value, context) => {
    if (!value) {
      context.addIssue({
        code: "custom",
        message: "Phone number is required.",
      });
      return;
    }

    if (!/^\d+$/.test(value)) {
      context.addIssue({
        code: "custom",
        message: "Enter numbers only.",
      });
      return;
    }

    if (value.length < 10) {
      const missingDigits = 10 - value.length;
      context.addIssue({
        code: "custom",
        message: `Phone number must be 10 digits. Add ${missingDigits} more ${
          missingDigits === 1 ? "digit" : "digits"
        }.`,
      });
    }

    if (value.length > 10) {
      const extraDigits = value.length - 10;
      context.addIssue({
        code: "custom",
        message: `Phone number must be 10 digits. Remove ${extraDigits} extra ${
          extraDigits === 1 ? "digit" : "digits"
        }.`,
      });
    }
  });

export const summitRegistrationSchema = z
  .object({
    first_name: requiredText("First name", 80),
    last_name: requiredText("Last name", 80),
    phone: phoneNumber,
    email: z.string().trim().email("Enter a valid email address.").max(320),
    industry: requiredText("Sector").refine(
      (value) =>
        SECTOR_OPTIONS.includes(value as (typeof SECTOR_OPTIONS)[number]),
      "Select a valid sector.",
    ),
    industry_other: z
      .string()
      .trim()
      .max(120, "Other sector must be 120 characters or fewer."),
    profession: requiredText("Organisation"),
    designation: requiredText("Designation"),
    place: requiredText("City"),
    participation_purpose: requiredText("Purpose of participation", 180),
    meeting_requests: z
      .array(z.string().trim().min(1).max(100))
      .max(4, "Select no more than four meeting requests."),
    summit_expectations: z
      .string()
      .trim()
      .max(1200, "Please keep your response within 1,200 characters."),
    website: z.string().max(0).optional(),
  })
  .superRefine((values, context) => {
    if (values.industry === "Other" && !values.industry_other) {
      context.addIssue({
        code: "custom",
        message: "Enter your sector.",
        path: ["industry_other"],
      });
    }
  });

export const redeemCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Enter a valid redeem code.")
    .max(40, "Enter a valid redeem code.")
    .regex(/^[A-Za-z0-9_-]+$/, "Enter a valid redeem code."),
});

export const corporateRegistrationSchema = z.object({
  first_name: requiredText("First name", 80),
  last_name: requiredText("Last name", 80),
  phone: phoneNumber,
  company_name: requiredText("Company name"),
  attendee_count: z.coerce
    .number()
    .int("Enter a whole number of people.")
    .min(2, "Corporate registration requires at least 2 people."),
  website: z.string().max(0).optional(),
});

export type RegistrationValues = Omit<
  z.infer<typeof summitRegistrationSchema>,
  "website"
>;

export type CorporateRegistrationValues = Omit<
  z.infer<typeof corporateRegistrationSchema>,
  "website"
>;
