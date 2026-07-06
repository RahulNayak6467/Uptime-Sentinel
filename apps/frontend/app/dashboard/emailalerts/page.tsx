import EmailAlertsInfo from "@/features/integrations/email-alerts/components/email-alerts";
import EmailAlertsHeaders from "@/features/integrations/email-alerts/components/email-alerts-headers";
import IntegrationChannels from "@/features/integrations/email-alerts/components/integration-channels";

const EmailAlerts = () => {
  return (
    <section className="min-h-full pb-12">
      <EmailAlertsHeaders />
      <div className="sf-page-content">
        <IntegrationChannels />
        <div className="mt-4">
        <EmailAlertsInfo />
        </div>
      </div>
    </section>
  );
};

export default EmailAlerts;
