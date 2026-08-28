"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PiArrowLeft,
  PiArrowRight,
  PiDownloadSimple,
  PiEye,
  PiMagnifyingGlass,
  PiSpinnerGap,
} from "react-icons/pi";

import { getWaitlistRegistrationExport } from "@/app/admin/actions";
import { exportWaitlistRegistrationsToExcel } from "@/lib/admin/export-waitlist-registrations";
import type {
  AdminPagination,
  WaitlistAdminFilters,
  WaitlistAdminRegistration,
} from "@/lib/admin/types";

export function AdminWaitlistDashboard({
  registrations,
  pagination,
  filters,
}: {
  registrations: WaitlistAdminRegistration[];
  pagination: AdminPagination;
  filters: WaitlistAdminFilters;
}) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  async function handleExport() {
    setExporting(true);
    setExportError("");

    try {
      const exportRows = await getWaitlistRegistrationExport({
        search: filters.search,
        sort: filters.sort,
      });
      await exportWaitlistRegistrationsToExcel(exportRows);
    } catch {
      setExportError("The Excel file could not be created. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--ink-16)] bg-white shadow-sm">
      <div className="border-b border-[var(--ink-16)] p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em]">
                Waitlist registration list
              </h2>
              <p className="mt-0.5 text-[14px] text-[var(--ink-72)]">
                {pagination.totalMatches} waitlist submissions ·{" "}
                {filters.sort === "recent" ? "recent first" : "oldest first"}
              </p>
            </div>
            <button
              className="inline-flex h-9 items-center justify-center gap-2 self-start whitespace-nowrap rounded-lg bg-[var(--navy)] px-3.5 text-[15px] font-semibold text-white transition hover:bg-[var(--navy-deep)] disabled:cursor-wait disabled:opacity-60 sm:self-auto"
              disabled={exporting || registrations.length === 0}
              onClick={handleExport}
              type="button"
            >
              {exporting ? (
                <PiSpinnerGap aria-hidden="true" className="animate-spin" />
              ) : (
                <PiDownloadSimple aria-hidden="true" />
              )}
              {exporting ? "Preparing..." : "Export Excel"}
            </button>
          </div>
          <form
            action="/admin/waitlist"
            className="grid gap-2 sm:grid-cols-[minmax(240px,1fr)_130px_auto_auto]"
            method="get"
          >
            <label className="relative" htmlFor="waitlist-search">
              <span className="sr-only">Search waitlist registrations</span>
              <PiMagnifyingGlass
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-48)]"
                aria-hidden="true"
              />
              <input
                className="field-input h-9 pl-10 text-[15px]"
                defaultValue={filters.search}
                id="waitlist-search"
                name="q"
                placeholder="Name, phone, organisation..."
                type="search"
              />
            </label>
            <label className="sr-only" htmlFor="waitlist-sort">
              Sort order
            </label>
            <select
              className="field-input h-9 text-[15px]"
              defaultValue={filters.sort}
              id="waitlist-sort"
              name="sort"
            >
              <option value="recent">Recent first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <button
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--navy)] px-3.5 text-[15px] font-semibold text-white"
              type="submit"
            >
              Apply
            </button>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--ink-16)] px-3.5 text-[15px] font-semibold text-[var(--ink-72)]"
              href="/admin/waitlist"
            >
              Clear
            </Link>
          </form>
          {exportError && (
            <p className="text-sm text-[#a8422c]" role="alert">
              {exportError}
            </p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] table-fixed text-left">
          <colgroup>
            <col className="w-[17%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[9%]" />
            <col className="w-[4%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--ink-16)] bg-[var(--paper)] text-[12px] font-semibold uppercase tracking-[0.07em] text-[var(--ink-48)]">
              <th className="px-3 py-2.5">Attendee</th>
              <th className="px-3 py-2.5">Contact</th>
              <th className="px-3 py-2.5">Organisation</th>
              <th className="px-3 py-2.5">City</th>
              <th className="px-3 py-2.5">Purpose</th>
              <th className="px-3 py-2.5">Submitted</th>
              <th className="px-3 py-2.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <WaitlistRow registration={registration} key={registration.id} />
            ))}
            {registrations.length === 0 && (
              <tr>
                <td
                  className="px-5 py-14 text-center text-sm text-[var(--ink-48)]"
                  colSpan={7}
                >
                  No waitlist registrations match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--ink-16)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-[var(--ink-48)]">
          Showing {registrations.length} on this page ·{" "}
          {pagination.totalMatches} total matches
        </p>
        <nav aria-label="Waitlist registration pagination" className="flex gap-2">
          {pagination.hasPrevious ? (
            <Link
              className="admin-page-button"
              href={pageHref(filters, pagination.previousCursor, "previous")}
            >
              <PiArrowLeft /> Previous
            </Link>
          ) : (
            <span className="admin-page-button opacity-40">
              <PiArrowLeft /> Previous
            </span>
          )}
          {pagination.hasNext ? (
            <Link
              className="admin-page-button"
              href={pageHref(filters, pagination.nextCursor, "next")}
            >
              Next <PiArrowRight />
            </Link>
          ) : (
            <span className="admin-page-button opacity-40">
              Next <PiArrowRight />
            </span>
          )}
        </nav>
      </div>
    </section>
  );
}

function WaitlistRow({
  registration,
}: {
  registration: WaitlistAdminRegistration;
}) {
  const href = `/admin/waitlist/${registration.id}`;
  const isCorporate = registration.registration_type === "corporate";
  const organisation = isCorporate
    ? registration.company_name
    : registration.profession;
  const profileLine = isCorporate
    ? `Corporate waitlist · ${formatPeople(registration.attendee_count)}`
    : [registration.designation, registration.industry]
        .filter(Boolean)
        .join(" · ");

  return (
    <tr className="border-b border-[var(--ink-16)] align-top text-[15px] leading-5 last:border-0 hover:bg-[var(--paper)]">
      <td className="px-3 py-3">
        <Link
          className="font-semibold hover:text-[var(--brass)]"
          href={href}
        >
          {registration.first_name} {registration.last_name}
        </Link>
        <p className="mt-0.5 font-mono text-[12px] text-[var(--ink-48)]">
          WL-{String(registration.id).padStart(6, "0")}
        </p>
        <p className="mt-1 text-[12px] font-semibold text-[var(--brass)]">
          {isCorporate
            ? `Corporate · ${formatPeople(registration.attendee_count)}`
            : "Individual · 1 Person"}
        </p>
      </td>
      <td className="break-words px-3 py-3 text-[var(--ink-72)]">
        <p className="break-all">{registration.email ?? "No email collected"}</p>
        <p className="mt-0.5">{registration.phone}</p>
      </td>
      <td className="break-words px-3 py-3">
        <p className="font-medium">{organisation ?? "Not provided"}</p>
        <p className="mt-0.5 text-[var(--ink-72)]">
          {profileLine || "Not provided"}
        </p>
      </td>
      <td className="break-words px-3 py-3 text-[var(--ink-72)]">
        {registration.place ?? "Not provided"}
      </td>
      <td className="break-words px-3 py-3 text-[var(--ink-72)]">
        {registration.participation_purpose ?? "Seat availability"}
      </td>
      <td className="px-3 py-3 text-[13px] leading-[1.35] text-[var(--ink-72)]">
        {formatDate(registration.created_at)}
      </td>
      <td className="px-3 py-3 text-right">
        <Link
          aria-label={`View ${registration.first_name}`}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--ink-16)] text-[var(--navy)] hover:border-[var(--navy)]"
          href={href}
        >
          <PiEye aria-hidden="true" />
        </Link>
      </td>
    </tr>
  );
}

function pageHref(
  filters: WaitlistAdminFilters,
  cursor: number | null,
  direction: "next" | "previous",
) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.sort !== "recent") params.set("sort", filters.sort);
  if (cursor) params.set("cursor", String(cursor));
  params.set("direction", direction);
  return `/admin/waitlist?${params.toString()}`;
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
