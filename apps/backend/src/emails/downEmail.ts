import logger from "../config/logger";
import resend from "../config/resend";
import { monitor_types } from "../shared/types/types";
import { emailAlertMap, generateReasonMessages } from "./emailHelper";

export const sendDownAlertEmail = async (
  type: monitor_types,
  email: string,
  monitorName: string,
  url: string,
  startedAt: Date,
  reason?: string | null,
  errorMessage?: string | null,
) => {

  const emailSubject = emailAlertMap.get(type)?.subject ?? "Monitor Down:"
  const title = emailAlertMap.get(type)?.title ?? "Monitor"
  const reasonText = generateReasonMessages(type, reason ?? null)

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `${emailSubject} Down: ${monitorName}`,
    html: `
    <div style="margin:0;padding:0;background-color:#f4f4f5;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
        <tr><td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:10px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr><td style="background-color:#dc2626;padding:22px 32px;">
              <span style="display:inline-block;color:#fecaca;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">&#9679;&nbsp;Down</span>
              <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:6px;">Your ${title} is down</div>
            </td></tr>
            <tr><td style="padding:28px 32px;">
              <p style="margin:0 0 22px;color:#3f3f46;font-size:14px;line-height:1.6;">
                We detected that <strong>${monitorName}</strong> is currently down. Details are below.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#3f3f46;border-collapse:collapse;">
                <tr><td style="padding:9px 0;color:#71717a;width:130px;vertical-align:top;">Monitor</td><td style="padding:9px 0;font-weight:600;">${monitorName}</td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">URL</td><td style="padding:9px 0;"><a href="${url}" style="color:#2563eb;text-decoration:none;">${url}</a></td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Down since</td><td style="padding:9px 0;">${startedAt.toLocaleString()}</td></tr>
                ${reasonText ? `<tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Reason</td><td style="padding:9px 0;">${reasonText}</td></tr>` : ""}
                ${errorMessage ? `<tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Error</td><td style="padding:9px 0;color:#dc2626;font-family:monospace;">${errorMessage}</td></tr>` : ""}
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
    logger.error({ err: error, monitorName }, "down alert email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName }, "down alert email sent");
  return data;
};
