import * as x509 from "@peculiar/x509";

export const getCrlUrl = (pem: string): string | null => {
  try {
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
  }
  catch (err) {
    return null;
  }
};
