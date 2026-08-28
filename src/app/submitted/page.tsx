import Link from "next/link";
import { PiCheckCircle } from "react-icons/pi";

import { SiteFooter } from "@/components/site-footer";
import { PrivateSummitShell, SummitHeader } from "@/components/summit-chrome";

export default function SubmittedPage() {
  return (
    <main className="summit-app flex flex-col">
      <SummitHeader activeStep={4} secureLabel="Secure interest form" />
      <PrivateSummitShell>
        <section className="summit-panel">
          <div className="summit-panel-body py-14 text-center sm:py-20">
            <PiCheckCircle className="mx-auto text-6xl text-[var(--seed)]" aria-hidden="true" />
            <p className="summit-kicker mt-6">Details received</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--ink)]">Thank you for sharing your details.</h1>
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-7 text-[var(--ink-72)]">If a seat becomes available, the organising team will contact you directly.</p>
            <Link className="button-secondary mt-8 inline-flex" href="/">Back to form</Link>
          </div>
        </section>
      </PrivateSummitShell>
      <SiteFooter />
    </main>
  );
}
