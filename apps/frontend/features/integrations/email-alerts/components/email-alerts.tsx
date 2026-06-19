import { Info } from "lucide-react";
import EmailAlertsHeaders from "./email-alerts-headers";
import EmailRecipients from "./email-recipients";
import EmailTypes from "./email-types";
import DeliveryPreferences from "./delivery-preferences/delivery-preferences";
import QuietHours from "./quiet-hours/quiet-hours";
import RecentAlerts from "./recent-alerts/recent-alerts";

const InfoBanner = () => (
  <div className="flex gap-2.5 mt-6 px-3.5 py-3 rounded-lg border border-sf-blue/20 bg-sf-blue-bg">
    <Info className="w-4 h-4 text-sf-blue shrink-0 mt-0.5" />
    <p className="text-[13px] font-sans text-sf-blue leading-snug">
      Alert emails are sent from{" "}
      <span className="font-semibold">alerts@statusforge.io</span>. Add this
      address to your contacts so incident notifications never land in spam.{" "}
      SMS, Slack, webhook and Discord channels are coming soon.
    </p>
  </div>
);

const EmailAlertsInfo = () => {
  return (
    <div>
      <div className="px-6 py-6">
        <EmailRecipients />
        <div className="grid grid-cols-2 gap-6 mt-6">
          <EmailTypes />
          <DeliveryPreferences />
        </div>
        <QuietHours />
        <InfoBanner />
        <RecentAlerts />
      </div>
    </div>
  );
};

export default EmailAlertsInfo;
