import tls from "node:tls";
import { X509Certificate } from "node:crypto";


export const tlsFetcher = (host: string, connection_timeout: number) => {

let ocspResponse: Buffer | null = null;
let handshake_time_ms: number;
let error_messages: string | null = null;
let error_code: string | null = null;

const start = performance.now();

const socket = tls.connect({
  host: host,
  port: 443,
  servername: host,
  timeout: connection_timeout,
  rejectUnauthorized: false,
  minVersion: "TLSv1.2",
  ALPNProtocols: ["h2", "http/1.1"],
  requestOCSP: true
})


socket.once("timeout", () => {
  socket.destroy(new Error("TLS connection timed out"));
})

socket.on("secureConnect", () => {
  handshake_time_ms = Math.ceil(performance.now() - start);

  const certificate = socket.getPeerCertificate(true);
  const x509Certificate = socket.getPeerX509Certificate();
  const publicKey = certificate.pubkey;
  const keyExchange = socket.getEphemeralKeyInfo() as tls.EphemeralKeyInfo;
  const publicKeyBase64 = certificate.pubkey?.toString("base64");
  const identityError = tls.checkServerIdentity(host, certificate);

  const certificateInformation = {
    common_name: certificate.subject.CN,
    san_names: certificate?.subjectaltname ?? "",
    subject: certificate.subject.CN,
    issuer: certificate.issuer.CN,

    leaf_certificate: {
      subject: certificate.subject.CN,
      issuer: certificate.issuer.CN,
      valid_from: certificate.valid_from,
      valid_to: certificate.valid_to,
      finger_print: certificate.fingerprint256,
      serial_number: certificate.serialNumber,
    },

    intermediate_certificate: {
      subject: certificate.issuerCertificate.subject.CN ?? null,
      issuer: certificate.issuerCertificate.issuer.CN ?? null,
      valid_to: certificate.issuerCertificate.valid_to ?? null,
      valid_from: certificate.issuerCertificate.valid_from ?? null,
      finger_print: certificate.issuerCertificate.fingerprint256 ?? null,
      serial_number: certificate.issuerCertificate.serialNumber ?? null,
    },

    signature_algorithm: x509Certificate?.signatureAlgorithm,
    authorization: socket.authorized,
    authorizationError: socket.authorizationError,
    tls_version: socket.getProtocol(),
    cipher_suite: socket.getCipher(),
    alpn_protocol: socket.alpnProtocol,
    publicKey: publicKeyBase64,

    keyExchange: {
      type: keyExchange?.type ?? null,
      name: keyExchange.name ?? null,
      size: keyExchange.size
    },

    ocsp_stapled: ocspResponse !== null,
    ocsp_response: ocspResponse ? ocspResponse?.toString("base64") : null,
    port: 443,
    host,
    server_name: host,
    connection_timeout,
    error_messages,
    error_code,
    asn1: certificate.asn1Curve,
    nist: certificate.nistCurve,
    handshake_timeout_ms: handshake_time_ms,
    revocation: {
      info_access: certificate.infoAccess,
    },
    hostname_match: identityError === undefined,
    hostname_match_error: identityError ? identityError.message : null,
    bits: certificate.bits,
    asymmetricKeyType: x509Certificate?.publicKey?.asymmetricKeyType,
  }

  if (x509Certificate) {
    console.log(getDaysRemaining(x509Certificate.validToDate));
    console.log(getCertificateLifetime(x509Certificate.validFromDate, x509Certificate.validToDate));
    console.log(getElapsedDays(x509Certificate.validFromDate));
    console.log(parseSanNames(certificateInformation.san_names));
    console.log(getCipherName(certificateInformation.cipher_suite));
    console.log(getForwardSecrecy(certificateInformation.keyExchange));
    console.log(getOcspResponder(certificateInformation.revocation.info_access));
  }
    socket.destroy();

  return certificateInformation;
})

socket.on("OCSPResponse", (response) => {
  ocspResponse = response;
})

socket.once("error", (error) => {
  console.log("An error occurred while connecting with tls");

  error_code =  (error as NodeJS.ErrnoException).code ?? null;
  error_messages = error.message;

})
}
tlsFetcher("www.youtube.com", 10_000);

type TimeRemaining = {
  totalMs: number;   // signed: negative when expired
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};

const getDaysRemaining = ( endDate: Date):TimeRemaining => {

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

const getCertificateLifetime = (startDate: Date, endDate: Date) => {
  const start = startDate
  const end = endDate

  const diffMs = end.getTime() - start.getTime();

  const absDiffMs = Math.abs(diffMs);
  const diffDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24))

  console.log(diffDays);

  return {
    lifetimeDays: diffDays,
    isExpired: diffMs <= 0,
  };
}

const getElapsedDays = (startDate: Date) => {
  const start = startDate;
  const end = new Date();

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  console.log(diffDays);

  return {
    elapsedDays: diffDays
  }
}

const parseSanNames = (sanString: string) => {
  if (sanString.length === 0) return [];
  const sanArr = sanString.split(", ").map((el) => el.replace("DNS:", ""));
  return sanArr
}

const getCipherName = (cipher: tls.CipherNameAndProtocol): string => cipher.name;

const getForwardSecrecy = (keyExchange: { type: string | null }): boolean =>
  keyExchange.type !== null;

const getOcspResponder = (
  infoAccess: Record<string, string[]> | undefined,
): string | null => infoAccess?.["OCSP - URI"]?.[0] ?? null;
