import { SecureVersion } from "tls";
import tls from "node:tls"
import { TlsAcceptedConnections } from "./tls.types";

// Per-version security verdict: deprecated versions Fail, TLS 1.2 rated by cipher
// (AEAD -> Pass, else Warn), TLS 1.3 Pass. Only called for an enabled version.
const rateProtocol = (version: SecureVersion, cipherSuite: string | null): "Pass" | "Warn" | "Fail" => {
  if (version === "TLSv1" || version === "TLSv1.1") return "Fail";
  if (version === "TLSv1.2") {
    if (!cipherSuite) return "Warn";
    return /GCM|CHACHA20|POLY1305/i.test(cipherSuite) ? "Pass" : "Warn";
  }
  return "Pass"; // TLSv1.3
};

export const probeProtocols = (host: string, version: SecureVersion, connection_timeout: number): Promise<TlsAcceptedConnections> => {
  return new Promise((resolve, reject) => {
  const socket = tls.connect({
    host,
    port: 443,
    servername: host,
    timeout: connection_timeout,
    rejectUnauthorized: false,
    minVersion: version,
    maxVersion: version,
  }, () => {
    const cipherSuite = socket.getCipher()?.name ?? null;
    socket.destroy();
    resolve({ name: version, enabled: true, rating: rateProtocol(version, cipherSuite), cipherSuite });
    return;
  });

  socket.once("error", (error) => {
    // Refused version is not a risk in itself -> Pass.
    resolve({ name: version, enabled: false, rating: "Pass", cipherSuite: null });
    return;
  });

  socket.once("timeout", () => {
    socket.destroy(new Error("TLS connection timed out"));
    resolve({ name: version, enabled: false, rating: "Pass", cipherSuite: null });
    return;
  });
  })
}

export const checkConnections = async (host: string, connection_timeout: number, tlsVersionUsed: SecureVersion) => {
  const versions: tls.SecureVersion[] = ["TLSv1.3", "TLSv1.2", "TLSv1.1", "TLSv1"];
  const connectedChecks: TlsAcceptedConnections[] = [];

  for (const version of versions) {
    const res = await probeProtocols(host, version, connection_timeout);
    let status: string;
    if (res.enabled === true && res.name === tlsVersionUsed) {
      res.status = "Preferred / Negotiated";
    }
    else if (res.enabled === true && res.name !== tlsVersionUsed) {
      res.status = "Offered";
    }
    else if (res.enabled === false) {
      res.status = "Refused";
    }
    connectedChecks.push(res);
  }

  const sslConnection: TlsAcceptedConnections = { name: "SSLv3", enabled: false, cipherSuite: null, rating: "Pass", status: "Refused" };

  connectedChecks.push(sslConnection)
  return connectedChecks;
}
