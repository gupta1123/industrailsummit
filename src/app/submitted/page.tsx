import Link from "next/link";
import { PiCheckCircle } from "react-icons/pi";

import { SiteFooter } from "@/components/site-footer";
import { PrivateSummitShell, SummitHeader } from "@/components/summit-chrome";

export default function SubmittedPage() {
  return (
    <main className="summit-app flex flex-col">
      <SummitHeader activeStep={4} />
      <PrivateSummitShell>
        <section className="summit-panel">
          <div className="summit-panel-body py-14 text-center sm:py-20">
            <PiCheckCircle className="mx-auto text-6xl text-[var(--seed)]" aria-hidden="true" />
            <p className="summit-kicker mt-6">Registration received</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">Thank you for registering.</h1>
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-7 text-[var(--ink-72)]">Your details have been saved successfully. There is no payment or email confirmation step for this registration.</p>
            <Link className="button-secondary mt-8 inline-flex" href="/">Submit another registration</Link>
          </div>
        </section>
      </PrivateSummitShell>
      <SiteFooter />
    </main>
  );
}
