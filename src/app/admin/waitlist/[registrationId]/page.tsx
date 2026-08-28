import Link from "next/link";
import { notFound } from "next/navigation";
import { PiArrowLeft } from "react-icons/pi";

import { AdminHeader } from "@/components/admin-header";
import { AdminNavigation } from "@/components/admin-navigation";
import { requireSummitAdmin } from "@/lib/admin/access";
import { getWaitlistRegistrationDetail } from "@/lib/admin/waitlist-data";

export const dynamic = "force-dynamic";

export default async function WaitlistRegistrationDetailPage({
  params,
}: PageProps<"/admin/waitlist/[registrationId]">) {
  const { registrationId } = await params;
  if (!/^\d+$/.test(registrationId)) notFound();
  const id = Number(registrationId);
  if (!Number.isSafeInteger(id) || id <= 0) notFound();

  const { email } = await requireSummitAdmin();
  const registration = await getWaitlistRegistrationDetail(id);
  if (!registration) notFound();
  const isCorporate = registration.registration_type === "corporate";

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <AdminHeader email={email} />
      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:py-5">
        <AdminNavigation active="waitlist" />
        <div className="min-w-0">
          <Link
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)] hover:text-[var(--brass)]"
            href="/admin/waitlist"
          >
            <PiArrowLeft aria-hidden="true" /> Back to waitlist entries
          </Link>
          <section className="overflow-hidden rounded-xl border border-[var(--ink-16)] bg-white shadow-sm">
            <div className="border-b border-[var(--ink-16)] bg-[var(--navy-deep)] px-5 py-5 text-white sm:px-7">
              <p className="font-mono text-xs tracking-[0.12em] text-[var(--steel)]">
                WL-{String(registration.id).padStart(6, "0")}
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">
                {registration.first_name} {registration.last_name}
              </h1>
              <p className="mt-1 text-sm text-white/65">
                {isCorporate
                  ? `Corporate · ${formatPeople(registration.attendee_count)}`
                  : "Individual · 1 Person"}{" "}
                · Submitted {formatDate(registration.created_at)}
              </p>
            </div>
            <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
              <DetailCard title="Attendee details">
                <Row
                  label="Email"
                  value={registration.email ?? "No email collected"}
                />
                <Row label="Phone" value={registration.phone} />
                <Row label="City" value={registration.place ?? "Not provided"} />
              </DetailCard>
              <DetailCard title={isCorporate ? "Corporate details" : "Professional profile"}>
                <Row
                  label={isCorporate ? "Company" : "Organisation"}
                  value={
                    isCorporate
                      ? registration.company_name ?? "Not provided"
                      : registration.profession ?? "Not provided"
                  }
                />
                <Row
                  label="People"
                  value={formatPeople(registration.attendee_count)}
                />
                {!isCorporate && (
                  <>
                    <Row
                      label="Designation"
                      value={registration.designation ?? "Not provided"}
                    />
                    <Row
                      label="Sector"
                      value={registration.industry ?? "Not provided"}
                    />
                  </>
                )}
              </DetailCard>
              <DetailCard title="Summit participation">
                <Row
                  label="Purpose"
                  value={registration.participation_purpose ?? "Seat availability"}
                />
                <Row
                  label="Notes"
                  value={registration.summit_expectations || "Not provided"}
                />
              </DetailCard>
              <DetailCard title="Submission record">
                <Row label="Source" value="Registrations closed form" />
                <Row label="Created" value={formatDate(registration.created_at)} />
                <Row label="Updated" value={formatDate(registration.updated_at)} />
              </DetailCard>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-[var(--ink-16)] bg-[var(--paper)] p-5">
      <h2 className="mb-3 font-semibold text-[var(--navy)]">{title}</h2>
      <dl className="divide-y divide-[var(--ink-16)] text-sm">{children}</dl>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[var(--ink-48)]">{label}</dt>
      <dd className="break-words sm:text-right">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPeople(count: number) {
  return `${count} ${count === 1 ? "Person" : "People"}`;
}
