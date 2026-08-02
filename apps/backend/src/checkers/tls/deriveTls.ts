import { CipherNameAndProtocol } from "node:tls";
import { CertificateLifetime, ElapsedDays, keyStrengthLevels, NextTlsExpiry, ProtocolCipherScan, TimeRemaining, TlsStatus, ValidationChecks } from "./tls.types";
import { checkConnections } from "./probeProtocols";

export const getDaysRemaining = ( endDate: Date):TimeRemaining => {

  const start = new Date()
  const end = endDate;

  const diffMs = end.getTime() - start.getTime();

  const absDiffMs = Math.abs(diffMs);

  const diffSeconds = Math.floor(absDiffMs / 1000) % 60;
  const diffMinutes = Math.floor(absDiffMs / (1000 * 60)) % 60;
  const diffHours = Math.floor(absDiffMs / (1000 * 60 * 60)) % 24;
  const diffDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));

  return {
    totalMs: absDiffMs,
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    seconds: diffSeconds,
    isExpired: diffMs <= 0
  }

}

export const getCertificateLifetime = (startDate: Date, endDate: Date): CertificateLifetime => {
  const start = startDate
  const end = endDate

  const diffMs = end.getTime() - start.getTime();

  const absDiffMs = Math.abs(diffMs);
  const diffDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24))

  return {
    lifetimeDays: diffDays,
    isExpired: diffMs <= 0,
  };
}

export const getElapsedDays = (startDate: Date): ElapsedDays  => {
  const start = startDate;
  const end = new Date();

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    elapsedDays: diffDays
  }
}

export const parseSanNames = (sanString: string): string[] => {
  if (sanString.length === 0) return [];
  const sanArr = sanString.split(", ").map((el) => el.replace("DNS:", ""));
  return sanArr
}

export const getCipherName = (cipher: CipherNameAndProtocol): string => cipher.name;

export const getForwardSecrecy = (keyExchange: { type: string | null }): boolean =>
  keyExchange.type !== null;

export const getOcspResponder = (
  infoAccess: Record<string, string[]> | undefined,
): string | null => infoAccess?.["OCSP - URI"]?.[0] ?? null;

export const inferKeyType = (asymmetricKeyType: string | undefined, nistCurve: string | undefined, modulus: string | undefined): string | null => {
  if (asymmetricKeyType !== undefined) return asymmetricKeyType;
  if (nistCurve !== undefined) return 'ec';
  if (modulus !== undefined) return 'rsa';
  return null;
}


export const keyLabel = (
  type: string | null,
  nistCurve: string | undefined,
  bits: number | undefined,
): string => {
  if (type === "ec") return `ECDSA ${nistCurve ?? `${bits ?? "?"}-bit`}`;
  if (type === "rsa") return `RSA ${bits ?? "?"}`;
  if (type === "ed25519") return "Ed25519";
  if (type === "ed448") return "Ed448";
  return "Unknown";
}

export const keyStrength = (inferKeyType: string | null, nist: string | undefined, bits: number | undefined) : keyStrengthLevels => {
  const asymmetricKeyType = inferKeyType;

  if (asymmetricKeyType === "ed25519" || asymmetricKeyType === "ed448")  return "Pass";

  if (bits === undefined) return "Warn";

  if (asymmetricKeyType === "ec") {
    if (bits >= 256) return "Pass";
    else return "Fail";
  }

  if (asymmetricKeyType === "rsa") {
    if (bits >= 3072) return "Pass";
    if (bits >= 2048) return "Warn";
    else return "Fail";
  }

  return "Warn";
}

export const validationChecks = (isCertificateTrusted: boolean,isExpired: boolean,validityStart: Date,hostnameCheck: boolean,subjectCN: string | undefined, issuerCN:string | undefined): ValidationChecks => {

  const start = new Date().getTime();
  const validationStart = validityStart.getTime();

  const validity_start_check = start - validationStart >= 0 ?  true : false;

  return {
    certificate_trust_check: isCertificateTrusted,
    validity_start_check,
    expiry_boundary_check: !isExpired,
    check_hostname_match: hostnameCheck,
    self_signed_check: subjectCN === issuerCN,
  }
}

export const computeStatus = (hostnameCheck: boolean, isExpired: boolean, subjectCN: string | undefined, issuerCN: string | undefined, isCertificateTrusted: boolean, endDate: Date, warningThresholdDays: number): TlsStatus => {

  const { days } = getDaysRemaining(endDate);

  if (isExpired) return "Expired";
  if (!hostnameCheck || subjectCN === issuerCN || !isCertificateTrusted) return "Invalid";
  if (days <= warningThresholdDays) return "Expiring";
  return "Valid";
}

export const computeNextExpiryAlert = (days: number): NextTlsExpiry  => {

  const thresholds = [1, 7, 14, 30] as const;
  if (days <= Math.min(...thresholds)) return {thresholdDays: null, dueInDays: null, estimatedAt: null};
  let maxThresholds = Math.max(...thresholds);
  for (let i = 0; i < thresholds.length; i++){
    if (thresholds[i] < days) {
      maxThresholds = thresholds[i];
    }
    else break;
  }

  return {
    thresholdDays: maxThresholds,
    dueInDays: days - maxThresholds,
    estimatedAt: new Date(Date.now() + (days - maxThresholds) * 24 * 60 * 60 * 1000),
  }

}

export const checkDeprecatedProtocol = async (host: string, connection_timeout: number) => {
  const res = await checkConnections(host, connection_timeout);

  const isDeprecated = res.some((protocol) => protocol.name === "TLSv1" && protocol.enabled === true || protocol.name === "TLSv1.1" && protocol.enabled === true)

  return isDeprecated ? "Fail" : "Pass";
}

export const signatureStrength = (
  signatureAlgorithm: string | undefined,
): "Pass" | "Warn" | "Fail" => {
  if (!signatureAlgorithm) return "Warn";

  const algo = signatureAlgorithm.toLowerCase();

  if (algo.includes("md5") || algo.includes("sha1")) return "Fail";
  if (

    algo.includes("sha256") ||
    algo.includes("sha384") ||
    algo.includes("sha512")
  ) {
    return "Pass";
  }
  return "Warn";
}



export const protocolAndCipherScan = async (host: string, connection_timeout: number, signatureAlgorithm:string | undefined,inferKeyType: string | null, nist: string | undefined, bits: number | undefined): Promise<ProtocolCipherScan> => {
  try {
    const connectedProtocols = await checkDeprecatedProtocol(host, connection_timeout);
    const isStrongSignature = signatureStrength(signatureAlgorithm);
    const checkKeyStrength = keyStrength(inferKeyType,nist,bits)

    return {
      configFindings: {
        noDeprcatedProtocols: connectedProtocols ?? "Fail",
        strongSignature: isStrongSignature,
        keyStrength: checkKeyStrength,
      }
    }
  }
  catch (err) {
    return {
      configFindings: {
        noDeprcatedProtocols: "Unknown",
        strongSignature:  signatureStrength(signatureAlgorithm),
        keyStrength: keyStrength(inferKeyType,nist,bits),
      }
   }
  }
}
