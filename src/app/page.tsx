import { PrivateRegistrationForm } from "@/components/private-registration-form";
import { SiteFooter } from "@/components/site-footer";
import { PrivateSummitShell, SummitHeader, SummitPanelHeader } from "@/components/summit-chrome";

export default function PrivateRegistrationPage() {
  return (
    <main className="summit-app flex flex-col">
      <SummitHeader activeStep={4} />
      <PrivateSummitShell>
        <section aria-labelledby="summit-panel-title" className="summit-panel">
          <SummitPanelHeader
            accent="attending?"
            description={<>This is what goes on your attendee record. Fields marked <span className="summit-required">*</span> are required.</>}
            step="Private registration"
            title="Who's"
          />
          <div className="summit-panel-body">
            <PrivateRegistrationForm />
          </div>
        </section>
      </PrivateSummitShell>
      <SiteFooter />
    </main>
  );
}
