import logger from "../config/logger";
import resend from "../config/resend";
import { formatDuration } from "../shared/utils/formatDate";

export const sendStillDownAlertEmail = async (
  email: string,
  monitorName: string,
  url: string,
  startedAt: Date,
) => {
  const downtimeDuration = formatDuration(startedAt, new Date());

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `🔴 Still Down: ${monitorName} (${downtimeDuration})`,
    html: `
      <h2>Your monitor is still down</h2>
      <p><strong>Monitor:</strong> ${monitorName}</p>
      <p><strong>URL:</strong> ${url}</p>
      <p><strong>Down since:</strong> ${startedAt.toLocaleString()}</p>
      <p><strong>Total downtime so far:</strong> ${downtimeDuration}</p>
    `,
  });

  if (error) {
    logger.error(
      { err: error, monitorName },
      "still-down alert email send failed",
    );
    return null;
  }

  logger.info(
    { emailId: data?.id, monitorName },
    "still-down alert email sent",
  );
  return data;
};
