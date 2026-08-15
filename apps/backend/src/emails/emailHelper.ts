import { env } from "../config/env";
import { monitor_types } from "../shared/types/types";
import { EmailShell } from "./types/email.types";

export const dashboardUrl = (monitor_id: string) =>
  `${env.FRONTEND_URL}/dashboard/monitors/${monitor_id}`;

export const detailRows = (rows: { label: string; value: string }[]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#3f3f46;border-collapse:collapse;">
    ${rows
      .map(
        (r) =>
          `<tr><td style="padding:9px 0;color:#71717a;width:130px;vertical-align:top;">${r.label}</td><td style="padding:9px 0;vertical-align:top;">${r.value}</td></tr>`,
      )
      .join("")}
  </table>`;

export const renderEmailShell =({ accent, badge, badgeColor, title, bodyHtml, ctaUrl, ctaLabel }: EmailShell) => `
  <div style="margin:0;padding:0;background-color:#f4f4f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:10px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr><td style="background-color:${accent};padding:22px 32px;">
            <span style="display:inline-block;color:${badgeColor};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">&#9679;&nbsp;${badge}</span>
            <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:6px;">${title}</div>
          </td></tr>
          <tr><td style="padding:28px 32px;">
            ${bodyHtml}
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr><td style="border-radius:8px;background-color:${accent};">
                <a href="${ctaUrl}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">${ctaLabel} &rarr;</a>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:18px 32px;border-top:1px solid #e4e4e7;">
            <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.5;">You're receiving this because alerts are enabled for this monitor on <strong style="color:#71717a;">StatusForge</strong>.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;

export const emailAlertMap = new Map<monitor_types, { subject: string, title: string }>
emailAlertMap.set('https', { subject: "Https Monitor", title:"https monitor" });
emailAlertMap.set('http', { subject: "Http Monitor", title: "http monitor" });
emailAlertMap.set('tls', { subject: "TLS Certificate", title: "tls certificate" });

export const generateReasonMessages = (type: monitor_types, reason: string | null) => {
  if (type === "http" || type === "https") return null;
  if (type === "tls") return tlsReasonMessages(reason);
}

  const tlsReasonMessages = (reason: string | null) => {
    const reasonMessages: Record<string, string> = {
      expired: "The certificate has expired and browsers will reject the connection.",
      revoked: "The certificate has been revoked by its issuer.",
      hostname_mismatch: "The certificate no longer matches the monitored hostname.",
      unreachable: "The server could not be reached to complete the TLS handshake.",
    };
    const reasonText = reason
      ? (reasonMessages[reason] ?? "The certificate failed validation.")
      : null;

    return reasonText;
  }
