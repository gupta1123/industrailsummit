export function PrivateRegistrationForm() {
  return (
    <div className="rounded-2xl border border-[rgb(13_161_167_/_22%)] bg-[var(--paper)] p-6 sm:p-8">
      <p className="summit-kicker">Registration update</p>
      <h3 className="mt-3 font-serif text-4xl leading-tight text-[var(--navy)]">
        All registrations are closed.
      </h3>
      <div className="mt-4 grid gap-3 text-[16px] leading-7 text-[var(--ink-72)]">
        <p>
          Thank you for the strong response to Industrial Summit 2026. The
          summit is now at final capacity.
        </p>
        <p>
          We are not accepting any new registration, link-only, or waitlist
          submissions at this time.
        </p>
        <p>
          For help with an already confirmed registration, please contact the
          summit organising team.
        </p>
      </div>
    </div>
  );
}
