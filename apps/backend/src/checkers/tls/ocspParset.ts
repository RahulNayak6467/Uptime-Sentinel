import * as x509 from "@peculiar/x509";
import { AsnConvert } from "@peculiar/asn1-schema";
import { CertificateTransparency } from "@peculiar/asn1-cert-transparency";
import { SignedCertificateTimestamp } from "@peculiar/asn1-cert-transparency";
import { getCertStatus } from "easy-ocsp";
import { getCtLogMap } from "./ctLogList";
import { CrlRevocation, OCSPStatus, ParseSCTExtension } from "./tls.types";
import { SCT_EXTENSION_OID } from "../../constants/constants";

export const getOcspStatus = async (x509Certificate: any): Promise<OCSPStatus> => {
  try {
    const ocsp = await getCertStatus(x509Certificate);
    return { status: ocsp.status, nextUpdateAt: ocsp.nextUpdate ?? null };
  }
  catch (err) {
    return {status: "unknown", nextUpdateAt:null }
  }
}

export const parseSCTExtensions = async (x509Certificate: any): Promise<ParseSCTExtension | null> => {
  const cert = new x509.X509Certificate(x509Certificate.toString());
  const sctExtension = cert.getExtension(SCT_EXTENSION_OID);
  if (!sctExtension) return null;
  try {
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
  catch (err) {
    return {
      status: "Unknown",
      sctCount: 0,
      deliveryMethod: "Embedded SCTs",
      logs: [],
    }
  }
}

const normalizeSerial = (s: string) => s.toLowerCase().replace(/[^0-9a-f]/g, "");

export const checkCrlRevocation = async (serialNumber: string, crlUrl: string):Promise<CrlRevocation> => {
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
    return {
      status: "unknown",
      checkedAt: new Date(),
    }
  }
}
