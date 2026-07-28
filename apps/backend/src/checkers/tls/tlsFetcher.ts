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
  rejectUnauthorized: true,
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

  // console.log(certificate);

  console.log(certificateInformation);

  socket.destroy();
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
