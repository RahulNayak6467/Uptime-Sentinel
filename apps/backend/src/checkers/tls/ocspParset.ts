import * as x509 from "@peculiar/x509";
import { AsnConvert } from "@peculiar/asn1-schema";
import { CertificateTransparency } from "@peculiar/asn1-cert-transparency";
import { SignedCertificateTimestamp } from "@peculiar/asn1-cert-transparency";
import { getCertStatus } from "easy-ocsp";
import { getCtLogMap } from "./ctLogList";

export const getOcspStatus = async (x509Certificate: any): Promise<{
   status: "good" | "revoked" | "unknown";
   nextUpdateAt: Date | null;
} | {
   status: string;
   nextUpdateAt: null;
}> => {
  try {
    const ocsp = await getCertStatus(x509Certificate);
    return { status: ocsp.status, nextUpdateAt: ocsp.nextUpdate ?? null };
  }
  catch (err) {
    return {status: "unknown", nextUpdateAt:null }
  }
}

export const parseSCTExtensions = async (x509Certificate: any) => {
  const cert = new x509.X509Certificate(x509Certificate.toString());
  const sctExtension = cert.getExtension("1.3.6.1.4.1.11129.2.4.2");
  if (!sctExtension) return null;

  const parsedAsnConvert = AsnConvert.parse(sctExtension.value, CertificateTransparency);
  const logMap = await getCtLogMap();

  const logs = parsedAsnConvert.items.map((sct) => {
    const logIdBase64 = Buffer.from(sct.logId).toString("base64");
    return {
      operator: logMap.get(logIdBase64) ?? "Unknown log",
      timestamp: sct.timestamp,
    };
  });

  return {
    status: logs.length > 0 ? "Logged" : "Not logged",
    sctCount: logs.length,
    deliveryMethod: "Embedded SCTs",
    logs,
  };
}

const normalizeSerial = (s: string) => s.toLowerCase().replace(/[^0-9a-f]/g, "");

export const checkCrlRevocation = async (serialNumber: string, crlUrl: string) => {
  const normalizedSerialNumber = normalizeSerial(serialNumber);
  try {
    const crlInfo = await fetch(crlUrl);
    const crlBytes = await crlInfo.arrayBuffer();

    const crl = new x509.X509Crl(crlBytes);
    const revoked = crl.entries.find(
      (e) => normalizeSerial(e.serialNumber) === normalizedSerialNumber,
    );

    if (revoked === undefined) {
      return {
        status: "not_listed",
        checkedAt: crl.thisUpdate,
        nextUpdate: crl.nextUpdate
      }
    }

    return {
      status: "revoked",
      revokedAt: revoked.revocationDate,
      checkedAt: crl.thisUpdate,
      nextUpdate: crl.nextUpdate
    }
  }
  catch (err) {
    console.log(err.message);
    return {
      status: "unknown",
      checkedAt: new Date(),
    }
  }
}
