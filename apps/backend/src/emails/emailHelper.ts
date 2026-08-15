import { monitor_types } from "../shared/types/types";

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
