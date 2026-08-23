import logger from "../config/logger";
import resend from "../config/resend";
import { monitor_types } from "../shared/types/types";
import { formatDuration } from "../shared/utils/formatDate";
import { dashboardUrl, detailRows, emailAlertMap, renderEmailShell } from "./emailHelper";

export const sendRecoveryEmail = async (
  type: monitor_types,
  email: string,
  monitorName: string,
  url: string,
  startedAt: Date,
  resolvedAt: Date,
  monitor_id: string,
) => {
  const duration = formatDuration(startedAt, resolvedAt);
  const emailSubject = emailAlertMap.get(type)?.subject ?? "Monitor Recovered";
  const title = emailAlertMap.get(type)?.title ?? "Monitor";
  const cta = dashboardUrl(monitor_id);

  const html = renderEmailShell({
    accent: "#16a34a",
    badge: "Recovered",
    badgeColor: "#bbf7d0",
    title: `Your ${title} has recovered`,
    bodyHtml: `
      <p style="margin:0 0 22px;color:#3f3f46;font-size:14px;line-height:1.6;">Good news &mdash; <strong>${monitorName}</strong> is back up and healthy again.</p>
      ${detailRows([
        { label: "Monitor", value: `<strong>${monitorName}</strong>` },
        { label: "URL", value: `<a href="${url}" style="color:#2563eb;text-decoration:none;">${url}</a>` },
        { label: "Recovered at", value: resolvedAt.toLocaleString() },
        { label: "Outage duration", value: `<strong>${duration}</strong>` },
      ])}`,
    ctaUrl: cta,
    ctaLabel: "View monitor",
  });

  const text = [
    `Your ${title} has recovered.`,
    ``,
    `Monitor: ${monitorName}`,
    `URL: ${url}`,
    `Recovered at: ${resolvedAt.toLocaleString()}`,
    `Outage duration: ${duration}`,
    ``,
    `View monitor: ${cta}`,
  ].join("\n");

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `${emailSubject} Recovered: ${monitorName}`,
    html,
    text,
  });
  if (error) {
    logger.error({ err: error, monitorName }, "recovery email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName }, "recovery email sent");
  return data;
};
