import logger from "../config/logger";
import resend from "../config/resend";
import { dashboardUrl, detailRows, renderEmailShell } from "./emailHelper";

export const sendExpiryEmail = async (
  email: string,
  monitorName: string,
  url: string,
  issuer: string,
  expiryDate: Date,
  daysRemaining: number,
  threshold: number,
  fingerprint: string,
  monitor_id: string,
) => {
  const cta = dashboardUrl(monitor_id);
  const dayLabel = daysRemaining === 1 ? "day" : "days";

  const html = renderEmailShell({
    accent: "#d97706",
    badge: "Certificate expiring",
    badgeColor: "#fde68a",
    title: `TLS certificate expires in ${daysRemaining} ${dayLabel}`,
    bodyHtml: `
      <p style="margin:0 0 22px;color:#3f3f46;font-size:14px;line-height:1.6;">
        The certificate for <strong>${monitorName}</strong> will expire soon. Renew it before the expiry date to avoid an outage &mdash; once it expires, connections to this host will fail.
      </p>
      ${detailRows([
        { label: "Monitor", value: `<strong>${monitorName}</strong>` },
        { label: "Host", value: `<a href="${url}" style="color:#2563eb;text-decoration:none;">${url}</a>` },
        { label: "Issuer", value: issuer },
        { label: "Expires in", value: `<strong>${daysRemaining} ${dayLabel}</strong>` },
        { label: "Expires on", value: `<strong>${expiryDate.toLocaleString()}</strong>` },
        { label: "Alert threshold", value: `${threshold} ${threshold === 1 ? "day" : "days"}` },
        { label: "Fingerprint", value: `<span style="font-family:monospace;font-size:12px;word-break:break-all;">${fingerprint}</span>` },
      ])}
      <p style="margin:22px 0 0;color:#71717a;font-size:13px;line-height:1.6;">
        You're receiving this because the certificate entered your <strong>${threshold}-${threshold === 1 ? "day" : "day"}</strong> expiry alert window. You'll get one alert per configured window.
      </p>`,
    ctaUrl: cta,
    ctaLabel: "View certificate",
  });

  const text = [
    `The TLS certificate for ${monitorName} expires in ${daysRemaining} ${dayLabel}.`,
    `Renew it before the expiry date to avoid an outage.`,
    ``,
    `Monitor: ${monitorName}`,
    `Host: ${url}`,
    `Issuer: ${issuer}`,
    `Expires in: ${daysRemaining} ${dayLabel}`,
    `Expires on: ${expiryDate.toLocaleString()}`,
    `Alert threshold: ${threshold} ${threshold === 1 ? "day" : "days"}`,
    `Fingerprint: ${fingerprint}`,
    ``,
    `View certificate: ${cta}`,
  ].join("\n");

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `TLS Certificate Expiring in ${daysRemaining} ${dayLabel}: ${monitorName}`,
    html,
    text,
  });
  if (error) {
    logger.error({ err: error, monitorName }, "expiry email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName }, "expiry email sent");
  return data;
};
