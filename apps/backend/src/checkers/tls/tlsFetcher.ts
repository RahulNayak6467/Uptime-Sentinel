import tls from "node:tls";

const host = "youtube.com";
const port = 443;

const socket = tls.connect(
  {
    host,
    port,

    // Required for SNI and correct certificate
    servername: host,

    // Allows us to inspect expired, self-signed or invalid certificates
    rejectUnauthorized: false,

    timeout: 10_000,
  },
  () => {
    // This callback runs after the TLS handshake completes

    const certificate = socket.getPeerCertificate(true);
    const cipher = socket.getCipher();

    console.log(socket)

    // const result = {
    //   host,
    //   port,

    //   authorized: socket.authorized,
    //   authorizationError: socket.authorizationError
    //     ? String(socket.authorizationError)
    //     : null,

    //   tlsVersion: socket.getProtocol(),

    //   cipher: {
    //     name: cipher.name,
    //     standardName: cipher.standardName,
    //   },

    //   certificate: {
    //     commonName: certificate.subject?.CN,
    //     issuer: certificate.issuer,
    //     subjectAlternativeNames: certificate.subjectaltname,
    //     validFrom: certificate.valid_from,
    //     validTo: certificate.valid_to,
    //     serialNumber: certificate.serialNumber,
    //     fingerprint256: certificate.fingerprint256,
    //   },

    //   connection: {
    //     ipAddress: socket.remoteAddress,
    //     port: socket.remotePort,
    //     ipFamily: socket.remoteFamily,
    //   },
    // };

    // console.dir(result, {
    //   depth: null,
    // });

    // Close after collecting the information
    socket.destroy();
  },
);

socket.once("timeout", () => {
  socket.destroy(new Error("TLS connection timed out"));
});

socket.once("error", (error) => {
  console.error({
    message: error.message,
    code: (error as NodeJS.ErrnoException).code,
  });
});
