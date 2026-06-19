import EmailAlertsInfo from "@/features/email-alerts/components/email-alerts";
import EmailAlertsHeaders from "@/features/email-alerts/components/email-alerts-headers";

const EmailAlerts = () => {
  return (
    <section className="pb-8 w-full">
      <EmailAlertsHeaders />
      <div className="w-[90%]">
        <EmailAlertsInfo />
      </div>
    </section>
  );
};

export default EmailAlerts;
