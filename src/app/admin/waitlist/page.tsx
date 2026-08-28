import { AdminHeader } from "@/components/admin-header";
import { AdminNavigation } from "@/components/admin-navigation";
import { AdminWaitlistDashboard } from "@/components/admin-waitlist-dashboard";
import { requireSummitAdmin } from "@/lib/admin/access";
import { getWaitlistRegistrationPage } from "@/lib/admin/waitlist-data";
import type { WaitlistAdminFilters } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function WaitlistAdminPage({
  searchParams,
}: PageProps<"/admin/waitlist">) {
  const filters = parseFilters(await searchParams);
  const { email } = await requireSummitAdmin();
  const data = await getWaitlistRegistrationPage(filters);

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <AdminHeader email={email} />
      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:py-5">
        <AdminNavigation active="waitlist" />
        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[var(--brass)]">
                Industrial Summit
              </p>
              <h1 className="mt-0.5 text-3xl font-semibold tracking-[-0.035em]">
                Waitlist entries
              </h1>
            </div>
            <p className="max-w-xl text-[15px] leading-6 text-[var(--ink-72)] sm:text-right">
              Review people who shared their details after regular
              registrations closed.
            </p>
          </div>
          <AdminWaitlistDashboard
            registrations={data.registrations}
            pagination={data.pagination}
            filters={filters}
          />
        </div>
      </div>
    </main>
  );
}

function parseFilters(
  params: Record<string, string | string[] | undefined>,
): WaitlistAdminFilters {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";
  const cursorValue = first(params.cursor);
  const parsedCursor =
    cursorValue && /^\d+$/.test(cursorValue) ? Number(cursorValue) : null;

  return {
    search: first(params.q).trim().slice(0, 80),
    sort: first(params.sort) === "oldest" ? "oldest" : "recent",
    cursor:
      parsedCursor && Number.isSafeInteger(parsedCursor) && parsedCursor > 0
        ? parsedCursor
        : null,
    direction: first(params.direction) === "previous" ? "previous" : "next",
  };
}
