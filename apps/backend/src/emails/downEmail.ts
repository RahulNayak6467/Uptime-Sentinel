import logger from "../config/logger";
import resend from "../config/resend";
import { monitor_types } from "../shared/types/types";
import { dashboardUrl, detailRows, emailAlertMap, generateReasonMessages, renderEmailShell } from "./emailHelper";

export const sendDownAlertEmail = async (
  type: monitor_types,
  email: string,
  monitorName: string,
  url: string,
  startedAt: Date,
  monitor_id: string,
  reason?: string | null,
  errorMessage?: string | null,
) => {
  const emailSubject = emailAlertMap.get(type)?.subject ?? "Monitor Down:";
  const title = emailAlertMap.get(type)?.title ?? "Monitor";
  const reasonText = generateReasonMessages(type, reason ?? null);
  const cta = dashboardUrl(monitor_id);

  const rows = [
    { label: "Monitor", value: `<strong>${monitorName}</strong>` },
    { label: "URL", value: `<a href="${url}" style="color:#2563eb;text-decoration:none;">${url}</a>` },
    { label: "Down since", value: startedAt.toLocaleString() },
  ];
  if (reasonText) rows.push({ label: "Reason", value: reasonText });
  if (errorMessage) rows.push({ label: "Error", value: `<span style="color:#dc2626;font-family:monospace;">${errorMessage}</span>` });

  const html = renderEmailShell({
    accent: "#dc2626",
    badge: "Down",
    badgeColor: "#fecaca",
    title: `Your ${title} is down`,
    bodyHtml: `
      <p style="margin:0 0 22px;color:#3f3f46;font-size:14px;line-height:1.6;">We detected that <strong>${monitorName}</strong> is currently down. Details are below.</p>
      ${detailRows(rows)}`,
    ctaUrl: cta,
    ctaLabel: "View monitor",
  });

  const text = [
    `Your ${title} is down.`,
    ``,
    `Monitor: ${monitorName}`,
    `URL: ${url}`,
    `Down since: ${startedAt.toLocaleString()}`,
    reasonText ? `Reason: ${reasonText}` : null,
    errorMessage ? `Error: ${errorMessage}` : null,
    ``,
    `View monitor: ${cta}`,
  ].filter(Boolean).join("\n");

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `${emailSubject} Down: ${monitorName}`,
    html,
    text,
  });
  if (error) {
    logger.error({ err: error, monitorName }, "down alert email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName }, "down alert email sent");
  return data;
};
