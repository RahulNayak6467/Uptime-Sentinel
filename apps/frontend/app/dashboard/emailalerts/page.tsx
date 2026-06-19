import EmailAlertsInfo from "@/features/integrations/email-alerts/components/email-alerts";
import EmailAlertsHeaders from "@/features/integrations/email-alerts/components/email-alerts-headers";
import IntegrationChannels from "@/features/integrations/email-alerts/components/integration-channels";

const EmailAlerts = () => {
  return (
    <section className="pb-8 w-full">
      <EmailAlertsHeaders />
      <IntegrationChannels />
      <div className="w-[90%]">
        <EmailAlertsInfo />
      </div>
    </section>
  );
};

export default EmailAlerts;
