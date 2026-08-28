"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PiArrowRight, PiCaretDown } from "react-icons/pi";

import {
  submitWaitlistRegistration,
  type WaitlistRegistrationState,
} from "@/app/private-actions";
import {
  PARTICIPATION_PURPOSES,
  SECTOR_OPTIONS,
} from "@/lib/summit/preferences";
import type { RegistrationValues } from "@/lib/summit/validation";

const emptyValues: RegistrationValues = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  industry: "",
  industry_other: "",
  profession: "",
  designation: "",
  place: "",
  participation_purpose: "",
  meeting_requests: [],
  summit_expectations: "",
};

const initialState: WaitlistRegistrationState = {
  values: emptyValues,
};

export function PrivateRegistrationForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitWaitlistRegistration,
    initialState,
  );
  const values = {
    ...emptyValues,
    ...state.values,
  };

  useEffect(() => {
    if (state.success) {
      router.push("/submitted");
    }
  }, [state.success, router]);

  if (!showForm) {
    return (
      <div className="rounded-2xl border border-[rgb(13_161_167_/_22%)] bg-[var(--paper)] p-6 sm:p-8">
        <p className="summit-kicker">Registrations update</p>
        <h3 className="mt-3 font-serif text-4xl leading-tight text-[var(--navy)]">
          Registrations are currently closed.
        </h3>
        <div className="mt-4 grid gap-3 text-[16px] leading-7 text-[var(--ink-72)]">
          <p>
            Thank you for the strong response to Industrial Summit 2026. We are
            currently at capacity, so regular registrations have been closed.
          </p>
          <p>
            If a confirmed delegate is unable to attend or an additional seat
            becomes available, the organising team may contact people from this
            list directly.
          </p>
        </div>
        <button
          className="button-primary mt-6 min-w-56 px-7 text-[15px]"
          onClick={() => setShowForm(true)}
          type="button"
        >
          Fill this form
          <PiArrowRight aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <WaitlistDetailsForm
      formAction={formAction}
      pending={pending}
      state={state}
      values={values}
    />
  );
}

function WaitlistDetailsForm({
  formAction,
  pending,
  state,
  values,
}: {
  formAction: React.ComponentProps<"form">["action"];
  pending: boolean;
  state: WaitlistRegistrationState;
  values: RegistrationValues;
}) {
  const [selectedSector, setSelectedSector] = useState(values.industry);

  return (
    <form action={formAction} noValidate>
      {state.message && (
        <div className="summit-alert" role="alert">
          {state.message}
        </div>
      )}

      <fieldset className="summit-fieldset">
        <legend className="summit-legend">Contact</legend>
        <div className="summit-field-grid">
          <Field
            label="First name"
            name="first_name"
            autoComplete="given-name"
            placeholder="Your first name"
            defaultValue={values.first_name}
            errors={state.errors?.first_name}
          />
          <Field
            label="Last name"
            name="last_name"
            autoComplete="family-name"
            placeholder="Your last name"
            defaultValue={values.last_name}
            errors={state.errors?.last_name}
          />
          <Field
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            defaultValue={values.email}
            errors={state.errors?.email}
          />
          <Field
            label="Phone number"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="9876543210"
            defaultValue={values.phone}
            errors={state.errors?.phone}
            inputMode="numeric"
            maxLength={10}
            onInput={restrictPhoneInput}
            pattern="[0-9]{10}"
          />
        </div>
      </fieldset>

      <fieldset className="summit-fieldset">
        <legend className="summit-legend">Organisation</legend>
        <div className="summit-field-grid">
          <Field
            label="Organisation"
            name="profession"
            autoComplete="organization"
            placeholder="Company or institution"
            defaultValue={values.profession}
            errors={state.errors?.profession}
          />
          <Field
            label="Designation"
            name="designation"
            autoComplete="organization-title"
            placeholder="e.g. Managing Director"
            defaultValue={values.designation}
            errors={state.errors?.designation}
          />
          <SelectField
            label="Sector"
            name="industry"
            placeholder="Select your sector"
            options={SECTOR_OPTIONS}
            defaultValue={values.industry}
            errors={state.errors?.industry}
            onChange={setSelectedSector}
          />
          {selectedSector === "Other" && (
            <Field
              label="Specify your sector"
              name="industry_other"
              autoComplete="off"
              placeholder="Enter your sector"
              defaultValue={values.industry_other}
              errors={state.errors?.industry_other}
            />
          )}
          <Field
            label="City"
            name="place"
            autoComplete="address-level2"
            placeholder="City, State"
            defaultValue={values.place}
            errors={state.errors?.place}
          />
        </div>
      </fieldset>

      <fieldset className="summit-fieldset">
        <legend className="summit-legend">What you want from the day</legend>
        <div className="summit-field-grid">
          <div className="summit-field-full">
            <SelectField
              label="Purpose of participation"
              name="participation_purpose"
              placeholder="Select a purpose"
              options={PARTICIPATION_PURPOSES}
              defaultValue={values.participation_purpose}
              errors={state.errors?.participation_purpose}
            />
          </div>
          <div className="summit-field-full">
            <div className="summit-field-label-row">
              <label
                className="field-label mb-0"
                htmlFor="summit_expectations"
              >
                Anything the organisers should know
              </label>
              <span className="summit-optional">Optional</span>
            </div>
            <p className="summit-field-hint mb-3">
              Share land requirements, sector specifics, or people you would
              particularly like to meet.
            </p>
            <textarea
              className="field-textarea"
              id="summit_expectations"
              name="summit_expectations"
              maxLength={1200}
              rows={5}
              placeholder="Tell us what would make this summit valuable for you..."
              defaultValue={values.summit_expectations}
            />
            {uniqueErrors(state.errors?.summit_expectations).map((error) => (
              <p className="summit-error" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>
      </fieldset>

      <HoneypotField />

      <div className="summit-actions">
        <p className="summit-actions-note">
          This is not a confirmed registration or payment link. The team will
          contact you only if a seat becomes available.
        </p>
        <button
          className="button-primary min-w-56 px-7 text-[15px]"
          type="submit"
          disabled={pending}
        >
          {pending ? "Submitting details..." : "Submit details"}
          {!pending && <PiArrowRight aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  hint,
  defaultValue,
  errors,
  inputMode,
  maxLength,
  onInput,
  pattern,
}: {
  label: string;
  name: keyof RegistrationValues;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  hint?: string;
  defaultValue: string;
  errors?: string[];
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  onInput?: React.FormEventHandler<HTMLInputElement>;
  pattern?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label} <span className="summit-required">*</span>
      </label>
      <input
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={errors?.length ? `${name}-error` : undefined}
        className="field-input"
        id={name}
        inputMode={inputMode}
        maxLength={maxLength}
        name={name}
        onInput={onInput}
        pattern={pattern}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required
      />
      {hint && <p className="summit-field-hint">{hint}</p>}
      {uniqueErrors(errors).map((error) => (
        <p className="summit-error" id={`${name}-error`} key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}

function SelectField({
  label,
  name,
  placeholder,
  options,
  defaultValue,
  errors,
  onChange,
}: {
  label: string;
  name: keyof RegistrationValues;
  placeholder: string;
  options: readonly string[];
  defaultValue: string;
  errors?: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label} <span className="summit-required">*</span>
      </label>
      <div className="summit-select-wrap">
        <select
          aria-describedby={errors?.length ? `${name}-error` : undefined}
          aria-invalid={Boolean(errors?.length)}
          className="field-input field-select"
          defaultValue={defaultValue}
          id={name}
          name={name}
          onChange={(event) => onChange?.(event.target.value)}
          required
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <PiCaretDown aria-hidden="true" />
      </div>
      {uniqueErrors(errors).map((error) => (
        <p className="summit-error" id={`${name}-error`} key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}

function HoneypotField() {
  return (
    <div
      className="absolute -left-[10000px] top-auto size-px overflow-hidden"
      aria-hidden="true"
    >
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

function uniqueErrors(errors: string[] | undefined) {
  return [...new Set(errors ?? [])];
}

function restrictPhoneInput(event: React.FormEvent<HTMLInputElement>) {
  event.currentTarget.value = event.currentTarget.value
    .replace(/\D/g, "")
    .slice(0, 10);
}
