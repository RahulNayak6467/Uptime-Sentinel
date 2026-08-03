import "reflect-metadata";
import tls from "node:tls";
import {
  checkDeprecatedProtocol,
  computeNextExpiryAlert,
  computeStatus,
  getCertificateLifetime,
  cipherSummary,
  getCipherName,
  getDaysRemaining,
  getElapsedDays,
  getForwardSecrecy,
  getOcspResponder,
  inferKeyType,
  keyLabel,
  keyStrength,
  parseSanNames,
  protocolAndCipherScan,
  validationChecks,
} from "./deriveTls";
import { checkConnections } from "./probeProtocols";
import { parseSCTExtensions, checkCrlRevocation, getOcspStatus } from "./ocspParset";
import { getCrlUrl } from "./parseCertExtensions";
import { CrlRevocation, TlsCertificateInfo, TlsResult } from "./tls.types";

export const tlsFetcher = async (host: string, connection_timeout: number): Promise<TlsResult> => {
  return new Promise((resolve, reject) => {

  let ocspResponse: Buffer | null = null;
  let handshake_time_ms: number;
  let error_messages: string | null = null;
  let error_code: string | null = null;

  const start = performance.now();

  const socket = tls.connect({
    host,
    port: 443,
    servername: host,
    timeout: connection_timeout,
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
    ALPNProtocols: ["h2", "http/1.1"],
    requestOCSP: true,
  });

  socket.once("timeout", () => {
    error_code = "ETIMEDOUT";
    error_messages = "TLS connection timed out";
    socket.destroy(new Error("TLS connection timed out"));
  });

  socket.on("secureConnect", async () => {
  try {
    handshake_time_ms = Math.ceil(performance.now() - start);

    const certificate = socket.getPeerCertificate(true);
    const x509Certificate = socket.getPeerX509Certificate();
    const publicKey = certificate.pubkey;
    const keyExchange = socket.getEphemeralKeyInfo() as tls.EphemeralKeyInfo;
    const publicKeyBase64 = certificate.pubkey?.toString("base64");
    const identityError = tls.checkServerIdentity(host, certificate);

    if (x509Certificate === undefined) {
      const certificateError: TlsResult =  {
        status: "Invalid",
        error: {
          code: "NO_CERTIFICATE",
          message: "No certificate presented by the server",
        },
        checkedAt: new Date(),
        host,
        port: 443,
        certificate: null,
        derived: null,
        offeredProtocols: null,
        configFindings: null,
        ocsp: null,
        crl: null,
        certificateTransparency: null
      }

      resolve(certificateError);
      return;
    }

    const certificateInformation: TlsCertificateInfo = {
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
        name: keyExchange?.name ?? null,
        size: keyExchange?.size,
      },

      ocsp_stapled: ocspResponse !== null,
      ocsp_response: ocspResponse ? ocspResponse.toString("base64") : null,
      port: 443,
      host,
      server_name: host,
      connection_timeout,
      error_messages,
      error_code,
      asn1: certificate.asn1Curve,
      nist: certificate.nistCurve,
      handshake_time_ms: handshake_time_ms,
      revocation: {
        info_access: certificate.infoAccess,
      },
      hostname_match: identityError === undefined,
      hostname_match_error: identityError ? identityError.message : null,
      bits: certificate.bits,
      asymmetricKeyType: x509Certificate?.publicKey?.asymmetricKeyType,
    };

      const type = inferKeyType(
        certificateInformation.asymmetricKeyType,
        certificateInformation.nist,
        certificate.modulus
      );

      const daysRemaining = getDaysRemaining(x509Certificate.validToDate);
      const { days, isExpired } = daysRemaining;

      const certificateLifetime = getCertificateLifetime(
        x509Certificate.validFromDate,
        x509Certificate.validToDate
      );
      const elapsedDays = getElapsedDays(x509Certificate.validFromDate);
      const parsedSanNames = parseSanNames(certificateInformation.san_names);
      const cipherName = getCipherName(certificateInformation.cipher_suite);
      const cipherSummaryLabel = cipherSummary(certificateInformation.cipher_suite, certificateInformation.keyExchange);
      const forwardSecrecy = getForwardSecrecy(certificateInformation.keyExchange);
      const ocspResponder = getOcspResponder(certificateInformation.revocation.info_access);
      const keyLabelCheck = keyLabel(type, certificateInformation.nist, certificate.bits);
      const keyStrengthCheck = keyStrength(type, certificateInformation.nist, certificate.bits);
      const validations = validationChecks(
        certificateInformation.authorization,
        isExpired,
        x509Certificate.validFromDate,
        certificateInformation.hostname_match,
        certificate.subject.CN,
        certificate.issuer.CN
      );
      const status = computeStatus(
        certificateInformation.hostname_match,
        isExpired,
        certificate.subject.CN,
        certificate.issuer.CN,
        certificateInformation.authorization,
        x509Certificate.validToDate,
        30
      );
     const nextExpiryAlert =  computeNextExpiryAlert(days);

    const crlUrl = getCrlUrl(x509Certificate.toString());

    const crl = crlUrl ?  await checkCrlRevocation(certificate.serialNumber, crlUrl): null;
    const offeredProtocols = await checkConnections(host, connection_timeout);
    const certificateTransparency = await parseSCTExtensions(x509Certificate);
    const { configFindings } = await protocolAndCipherScan(host, connection_timeout, certificateInformation.signature_algorithm, type, certificateInformation.nist, certificate.bits)
    const ocsp = await getOcspStatus(x509Certificate);


    const tlsFetchData: TlsResult =  {
      status,
      error: null,
      checkedAt: new Date(),
      host,
      port: 443,

      certificate: certificateInformation,

      derived: {
        daysRemaining,
        certificateLifetime,
        elapsedDays,
        subjectAlternativeNames: parsedSanNames,
        publicKey: keyLabelCheck,
        keyStrength: keyStrengthCheck,
        forwardSecrecy,
        cipherName,
        cipherSummary: cipherSummaryLabel,
        ocspResponder,
        validationChecks: validations,
        nextExpiryAlert,
      },

      offeredProtocols,
      configFindings,
      ocsp,
      crl,
      certificateTransparency
    }

    console.log(tlsFetchData);
    resolve(tlsFetchData);
    return;
  }
  catch (err) {
    const tlsErrorProcessing: TlsResult = {
      status: "Invalid",
      error: {
        code: "TLS_PROCESSING_ERROR",
        message: (err as Error).message
      },
      checkedAt: new Date(),
      host,
      port: 443,
      certificate: null,
      derived: null,
      offeredProtocols: null,
      configFindings: null,
      ocsp: null,
      crl: null,
      certificateTransparency: null
    }
    resolve(tlsErrorProcessing);
    return;
  }
  finally{
    socket.destroy()
  }
  });

  socket.on("OCSPResponse", (response) => {
    ocspResponse = response;
  });


  socket.once("error", (error) => {
    error_code = (error as NodeJS.ErrnoException).code ?? error_code ??  null;
    error_messages = error.message;

    const connectionError: TlsResult = {
      status: "Unreachable",
      error: {
        code: error_code,
        message: error_messages
      },
      checkedAt: new Date(),
      host,
      port: 443,
      certificate: null,
      derived: null,
      offeredProtocols: null,
      configFindings: null,
      ocsp: null,
      crl: null,
      certificateTransparency: null
    }
    resolve(connectionError);
    return;
  });
 })
};

tlsFetcher("www.x.com", 10000);
