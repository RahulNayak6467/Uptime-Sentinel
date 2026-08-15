import logger from "../config/logger";
import resend from "../config/resend";
import { dashboardUrl, detailRows, renderEmailShell } from "./emailHelper";

export const sendRenewalEmail = async (
  email: string,
  monitorName: string,
  url: string,
  issuer: string,
  newExpiry: Date,
  fingerprint: string,
  monitor_id: string,
) => {
  const cta = dashboardUrl(monitor_id);

  const html = renderEmailShell({
    accent: "#2563eb",
    badge: "Certificate renewed",
    badgeColor: "#bfdbfe",
    title: "A new TLS certificate was detected",
    bodyHtml: `
      <p style="margin:0 0 22px;color:#3f3f46;font-size:14px;line-height:1.6;">
        The certificate for <strong>${monitorName}</strong> has changed &mdash; a new one is now being served. This is usually a routine renewal and <strong>no action is needed</strong>. We're sharing the new certificate's details so you can confirm it looks right.
      </p>
      ${detailRows([
        { label: "Monitor", value: `<strong>${monitorName}</strong>` },
        { label: "Host", value: `<a href="${url}" style="color:#2563eb;text-decoration:none;">${url}</a>` },
        { label: "Issuer", value: issuer },
        { label: "Valid until", value: `<strong>${newExpiry.toLocaleString()}</strong>` },
        { label: "Fingerprint", value: `<span style="font-family:monospace;font-size:12px;word-break:break-all;">${fingerprint}</span>` },
      ])}
      <p style="margin:22px 0 0;color:#71717a;font-size:13px;line-height:1.6;">
        If you weren't expecting a certificate change for this host, review it &mdash; an unexpected renewal can indicate a misconfiguration or, rarely, a compromised endpoint.
      </p>`,
    ctaUrl: cta,
    ctaLabel: "View certificate",
  });

  const text = [
    `A new TLS certificate was detected for ${monitorName}.`,
    `This is usually a routine renewal — no action is needed.`,
    ``,
    `Monitor: ${monitorName}`,
    `Host: ${url}`,
    `Issuer: ${issuer}`,
    `Valid until: ${newExpiry.toLocaleString()}`,
    `Fingerprint: ${fingerprint}`,
    ``,
    `View certificate: ${cta}`,
  ].join("\n");

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `TLS Certificate Renewed: ${monitorName}`,
    html,
    text,
  });
  if (error) {
    logger.error({ err: error, monitorName }, "renewal email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName }, "renewal email sent");
  return data;
};
