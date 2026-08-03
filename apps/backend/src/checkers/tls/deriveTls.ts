import { CipherNameAndProtocol } from "node:tls";
import { CertificateLifetime, CrlRevocation, ElapsedDays, keyStrengthLevels, NextTlsExpiry, OCSPStatus, ParseSCTExtension, ProtocolCipherScan, RevocationShaper, SecurityGrade, TimeRemaining, TlsAcceptedConnections, TlsStatus, ValidationChecks } from "./tls.types";
import { checkConnections } from "./probeProtocols";
import { CERTIFICATE_WEIGHTAGE, SECURITY_GRADE_PARAMETRES, SIGNATURE_STRENGTH_WEIGHTAGE, TLS_1_POINT_1_SUPPORT_DEPRECATED_VERSION, TLS_1_SUPPORT_DEPRECATED_VERSION, VALIDATION_CHECK_SCORES } from "../../constants/constants";
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

export const cipherSummary = (
  cipher: CipherNameAndProtocol,
  keyExchange: { name: string | null },
): string => (keyExchange.name ? `${keyExchange.name} · ${cipher.name}` : cipher.name);

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
  if (type === "ec") {
    const parts = [nistCurve, bits !== undefined ? `${bits}-bit` : undefined].filter(Boolean);
    return parts.length ? `ECDSA ${parts.join(" · ")}` : "ECDSA";
  }
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

export const computeSecurityGrade = (validations: ValidationChecks,signatureAlgorithm:string | undefined, protocolSupported: TlsAcceptedConnections[],inferKeyType: string | null, nist: string | undefined, bits: number | undefined): SecurityGrade => {
  const isStrongSignature = signatureStrength(signatureAlgorithm);
  const checkKeyStrength = keyStrength(inferKeyType, nist, bits);
  const checkValidationsPerformance = validations;

  const computedCertificate = computeCertificateStrength(validations);
  const computedKeyStrength = computeKeyStrength(checkKeyStrength,inferKeyType,bits);
  const computedSignatureStrength = computeSignatureStrength(signatureAlgorithm);
  const computedProtocolSupport = computeProtocolSupport(protocolSupported);

  const certificateScore = computedCertificate * CERTIFICATE_WEIGHTAGE + computedSignatureStrength.score * SIGNATURE_STRENGTH_WEIGHTAGE;
  const protocolSupportedScore = computedProtocolSupport;
  const signatureStrengthScore = computedSignatureStrength.score;
  const keyStrengthScore = computedKeyStrength.score;

  const overallSecurityScore = Math.round((certificateScore + protocolSupportedScore + signatureStrengthScore + keyStrengthScore) / SECURITY_GRADE_PARAMETRES);

  const securityGradeResult = {
    grade: computeGrade(overallSecurityScore),
    overall: overallSecurityScore,
    scores: [{
      label: "CERTIFICATE_SCORE",
      value: certificateScore
    }, {
      label: "PROTOCOL_SUPPORTED_SCORE",
      value: protocolSupportedScore,
      }, {
      label: "SIGNATURE_STRENGTH_SCORE",
      value: signatureStrengthScore,
      },{
      label: "KEY_STRENGTH_SCORE",
      value: keyStrengthScore,
    }]
  }

  return securityGradeResult;
}

export const computeGrade = (score: number): SecurityGrade["grade"] => {
  if (score >= 95) return "A+";
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  else return "F";
}

export const computeKeyStrength = (checkKeyStrength: keyStrengthLevels, inferKeyType: string | null, bits: number | undefined): { score: number, level: "Pass" | "Fail" | "Warn" } => {
  if (inferKeyType) {
    inferKeyType = inferKeyType.toLowerCase();
  }
  if (inferKeyType === "ed25519" || inferKeyType === "ed448") return { score: 100, level: "Pass" };
  else if (inferKeyType === "ec") {
    if (!bits) return { score: 50, level: "Warn" };
    else if (bits  >= 256) return { score: 100, level: "Pass" };
    else if (bits  < 256) return { score: 20, level: "Fail" };
  }
  else if (inferKeyType === "rsa") {
    if (!bits) return { score: 50, level: "Warn" };
    else if (bits as number >= 3072) return { score: 100, level: "Pass" };
    else if (bits >= 2048) return { score: 60, level: "Warn" };
    else if (bits <= 2048) return { score: 20, level: "Fail" };
  }
  else if (inferKeyType === "unknown") {
    return { score: 50, level: "Warn" };
  }

  return { score: 50, level: "Warn" };
}

export const computeSignatureStrength = (signatureAlgorithm: string | undefined): { score: number, level: "Pass" | "Fail" | "Warn" } => {

  if (!signatureAlgorithm) return { score: 50, level: "Warn" };
  signatureAlgorithm = signatureAlgorithm.toLowerCase();
  if (signatureAlgorithm.includes("sha384") || signatureAlgorithm.includes("sha512")) return { score: 100, level: "Pass" };
  else if (signatureAlgorithm.includes("sha256")) return { score: 90, level: "Pass" };
  else if (signatureAlgorithm.includes("md5") || signatureAlgorithm.includes("sha1")) return { score: 0, level: "Fail" };

  return { score: 50, level: "Warn" };
}

export const computeProtocolSupport = (protocolSupported: TlsAcceptedConnections[]): number => {
  let protocolSupportScore = 100;

  const supportModernVersionTls = protocolSupported.some((el) => el.name === "TLSv1.3" && el.enabled === false);
  const supportSecondModernVersionTls = protocolSupported.some((el) => el.name === "TLSv1.2" && el.enabled === false);

  if (protocolSupported.some((el) => el.name === "TLSv1" && el.enabled === true)){
    protocolSupportScore -= TLS_1_SUPPORT_DEPRECATED_VERSION;
  }
  else if (protocolSupported.some((el) => el.name === "TLSv1.1" && el.enabled === true)) {
    protocolSupportScore -= TLS_1_POINT_1_SUPPORT_DEPRECATED_VERSION;
  }
  else if (supportModernVersionTls && supportSecondModernVersionTls) {
    return 0;
  }

  return protocolSupportScore;
}

export const computeCertificateStrength = (validations: ValidationChecks): number => {
  const validationScoreConstant = VALIDATION_CHECK_SCORES;
  let certificateScore = 0;
  if (validations.certificate_trust_check) {
    certificateScore += VALIDATION_CHECK_SCORES;
  }
  if (validations.check_hostname_match) {
    certificateScore += VALIDATION_CHECK_SCORES;
  }
  if (validations.expiry_boundary_check) {
    certificateScore += VALIDATION_CHECK_SCORES;
  }
  if (validations.self_signed_check) {
    certificateScore += VALIDATION_CHECK_SCORES;
  }
  if (validations.validity_start_check) {
    certificateScore += VALIDATION_CHECK_SCORES;
  }

  return certificateScore;
}

export const computeRevocationShaper = (ocsp: OCSPStatus | null,
crl: CrlRevocation | null,
ct: ParseSCTExtension | null,
ocspStapled: boolean,
ocspResponder: string | null,
  mustStaple: boolean): RevocationShaper => {

  const status = ocsp?.status === "good" ? "Good" : ocsp?.status === "revoked" ? "Revoked" : "Warn";

  const checks: RevocationShaper["checks"] = [
    {
      label: "OCSP stapling",
      description: ocspStapled ? "Response served in the handshake" : "Not stapled",
      status: ocspStapled ? "Pass" : "Warn"
    },
    {
      label: "Revocation Status",
      description:  `Responder reports "${ocsp?.status ?? crl?.status ?? "unknown"}`,
      status: (ocsp?.status ?? crl?.status) === "revoked" ? "Fail"
        : (ocsp?.status ?? crl?.status) === "good" ? "Pass"
          : "Warn",
    },
    {
      label: "SCTs embedded",
      description: `${ct?.sctCount ?? 0} signed timestamps`,
      status: (ct?.sctCount ?? 0) >= 2 ? "Pass" : "Warn",
    }
  ]

  const ctLogs = ct?.logs ?? [];

  const revocationCard: RevocationShaper= {
    overall: status,
    checks,
    footer: {
      ocspResponder,
      nextOcspUpdate: ocsp?.nextUpdateAt ?? null,
      ctLogs,
      mustStaple,
    }
  }

  return revocationCard;
}
