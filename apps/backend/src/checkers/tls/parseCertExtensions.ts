import * as x509 from "@peculiar/x509";
import { AsnParser, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { MUST_STAPLE_OID } from "../../constants/constants";

class TlsFeatures {
  @AsnProp({ type: AsnPropTypes.Integer, repeated: "sequence" })
  public features: number[] = [];
}

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


export const parseMustStaple = (pem:string): boolean => {
  try {
    const cert = new x509.X509Certificate(pem);
    const ext = cert.getExtension(MUST_STAPLE_OID);
    if (!ext) return false;
    const parsed = AsnParser.parse(ext.value, TlsFeatures);

    return parsed.features.includes(5);
  }
  catch (err) {
    return false;
  }
}
