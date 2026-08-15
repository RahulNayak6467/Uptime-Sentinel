import logger from "../config/logger";
import resend from "../config/resend";
import { monitor_types } from "../shared/types/types";
import { formatDuration } from "../shared/utils/formatDate";
import { emailAlertMap } from "./emailHelper";

export const sendRecoveryEmail = async (
  type:monitor_types,
  email: string,
  monitorName: string,
  url: string,
  startedAt: Date,
  resolvedAt: Date,
) => {
  const duration = formatDuration(startedAt, resolvedAt);

  const emailSubject = emailAlertMap.get(type)?.subject ?? "Monitor Recovered"
  const title = emailAlertMap.get(type)?.title ?? "Monitor"

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `${emailSubject} Recovered: ${monitorName}`,
    html: `
    <div style="margin:0;padding:0;background-color:#f4f4f5;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
        <tr><td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:10px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr><td style="background-color:#16a34a;padding:22px 32px;">
              <span style="display:inline-block;color:#bbf7d0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">&#9679;&nbsp;Recovered</span>
              <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:6px;">Your ${title} has recovered</div>
            </td></tr>
            <tr><td style="padding:28px 32px;">
              <p style="margin:0 0 22px;color:#3f3f46;font-size:14px;line-height:1.6;">
                Good news — <strong>${monitorName}</strong> is back up and healthy again.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#3f3f46;border-collapse:collapse;">
                <tr><td style="padding:9px 0;color:#71717a;width:130px;vertical-align:top;">Monitor</td><td style="padding:9px 0;font-weight:600;">${monitorName}</td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">URL</td><td style="padding:9px 0;"><a href="${url}" style="color:#2563eb;text-decoration:none;">${url}</a></td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Recovered at</td><td style="padding:9px 0;">${resolvedAt.toLocaleString()}</td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Outage duration</td><td style="padding:9px 0;font-weight:600;">${duration}</td></tr>
              </table>
            </td></tr>
            <tr><td style="padding:18px 32px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.5;">You're receiving this because alerts are enabled for this monitor on <strong style="color:#71717a;">StatusForge</strong>.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </div>
    `,
  });
  if (error) {
    logger.error({ err: error, monitorName: monitorName }, "recovery email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName: monitorName }, "recovery email sent");
  return data;
};
