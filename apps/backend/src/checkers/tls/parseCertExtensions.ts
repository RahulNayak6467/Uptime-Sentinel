import * as x509 from "@peculiar/x509";

// OID for the Certificate Transparency SCT list extension (embedded SCTs).
const SCT_EXTENSION_OID = "1.3.6.1.4.1.11129.2.4.2";

// Extracts the first CRL distribution point URL from the certificate.
// Returns null when the cert has no CRL Distribution Points extension.
export const getCrlUrl = (pem: string): string | null => {
  const cert = new x509.X509Certificate(pem);
  const crlExt = cert.getExtension(x509.CRLDistributionPointsExtension);
  if (!crlExt) return null;

  for (const point of crlExt.distributionPoints) {
    const names = point.distributionPoint?.fullName ?? [];
    for (const name of names) {
      if (name.uniformResourceIdentifier) return name.uniformResourceIdentifier;
    }
  }
  return null;
};

// Reports whether the certificate carries embedded SCTs (Certificate
// Transparency). Full SCT-list decoding (per-log operator + timestamp) is
// deferred; this only confirms CT presence, which is the signal the UI needs.
export const getSctInfo = (pem: string): { present: boolean } => {
  const cert = new x509.X509Certificate(pem);
  const sctExt = cert.getExtension(SCT_EXTENSION_OID);
  return { present: sctExt !== null };
};
