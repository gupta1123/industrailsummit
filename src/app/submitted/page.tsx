import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { PrivateSummitShell, SummitHeader } from "@/components/summit-chrome";

export default function SubmittedPage() {
  return (
    <main className="summit-app flex flex-col">
      <SummitHeader activeStep={4} secureLabel="Registrations closed" />
      <PrivateSummitShell>
        <section className="summit-panel">
          <div className="summit-panel-body py-14 text-center sm:py-20">
            <p className="summit-kicker">Registration update</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
              Registrations are closed.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-7 text-[var(--ink-72)]">
              We are no longer accepting new submissions for Industrial Summit
              2026. Please contact the organising team for help with an already
              confirmed registration.
            </p>
            <Link className="button-secondary mt-8 inline-flex" href="/">
              Back to registration update
            </Link>
          </div>
        </section>
      </PrivateSummitShell>
      <SiteFooter />
    </main>
  );
}
