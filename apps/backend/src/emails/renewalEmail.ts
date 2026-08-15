import logger from "../config/logger";
import resend from "../config/resend";

export const sendRenewalEmail = async (
  email: string,
  monitorName: string,
  url: string,
  issuer: string,
  newExpiry: Date,
  fingerprint: string,
) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `TLS Certificate Renewed: ${monitorName}`,
    html: `
    <div style="margin:0;padding:0;background-color:#f4f4f5;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
        <tr><td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:10px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr><td style="background-color:#2563eb;padding:22px 32px;">
              <span style="display:inline-block;color:#bfdbfe;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">&#9679;&nbsp;Certificate renewed</span>
              <div style="color:#ffffff;font-size:20px;font-weight:700;margin-top:6px;">A new TLS certificate was detected</div>
            </td></tr>
            <tr><td style="padding:28px 32px;">
              <p style="margin:0 0 22px;color:#3f3f46;font-size:14px;line-height:1.6;">
                The certificate for <strong>${monitorName}</strong> has changed &mdash; a new one is now being served. This is usually a routine renewal and <strong>no action is needed</strong>. We're sharing the new certificate's details so you can confirm it looks right.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#3f3f46;border-collapse:collapse;">
                <tr><td style="padding:9px 0;color:#71717a;width:130px;vertical-align:top;">Monitor</td><td style="padding:9px 0;font-weight:600;">${monitorName}</td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Host</td><td style="padding:9px 0;"><a href="${url}" style="color:#2563eb;text-decoration:none;">${url}</a></td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Issuer</td><td style="padding:9px 0;">${issuer}</td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Valid until</td><td style="padding:9px 0;font-weight:600;">${newExpiry.toLocaleString()}</td></tr>
                <tr><td style="padding:9px 0;color:#71717a;vertical-align:top;">Fingerprint</td><td style="padding:9px 0;font-family:monospace;font-size:12px;word-break:break-all;">${fingerprint}</td></tr>
              </table>
              <p style="margin:22px 0 0;color:#71717a;font-size:13px;line-height:1.6;">
                If you weren't expecting a certificate change for this host, review it &mdash; an unexpected renewal can indicate a misconfiguration or, rarely, a compromised endpoint.
              </p>
            </td></tr>
            <tr><td style="padding:18px 32px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;line-height:1.5;">You're receiving this because renewal alerts are enabled for this monitor on <strong style="color:#71717a;">StatusForge</strong>.</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </div>
    `,
  });
  if (error) {
    logger.error({ err: error, monitorName }, "renewal email send failed");
    return null;
  }

  logger.info({ emailId: data?.id, monitorName }, "renewal email sent");
  return data;
};
