import { PrivateRegistrationForm } from "@/components/private-registration-form";
import { SiteFooter } from "@/components/site-footer";
import { PrivateSummitShell, SummitHeader, SummitPanelHeader } from "@/components/summit-chrome";

export default function PrivateRegistrationPage() {
  return (
    <main className="summit-app flex flex-col">
      <SummitHeader activeStep={4} secureLabel="Secure interest form" />
      <PrivateSummitShell>
        <section aria-labelledby="summit-panel-title" className="summit-panel">
          <SummitPanelHeader
            accent="closed"
            description="You may still share your details for consideration if a confirmed seat opens."
            step="Industrial Summit 2026"
            title="Registrations"
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
