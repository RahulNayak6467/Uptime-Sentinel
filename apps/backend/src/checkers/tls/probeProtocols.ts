import { SecureVersion } from "tls";
import tls from "node:tls"
import { TlsAcceptedConnections } from "./tls.types";
import { getCertStatusByDomain } from "easy-ocsp";

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
    socket.destroy();
    resolve({name: version, enabled: true});
  });

  socket.once("error", (error) => {
    console.log("An error occurred while connecting with tls");
    resolve({ name: version, enabled: false });
  });

  socket.once("timeout", () => {
    socket.destroy(new Error("TLS connection timed out"));
    resolve({ name: version,enabled: false});
  });
  })
}

export const checkConnections = async (host: string, connection_timeout: number) => {
  const versions: tls.SecureVersion[] = ["TLSv1.3", "TLSv1.2", "TLSv1.1", "TLSv1"];
  const connectedChecks: TlsAcceptedConnections[] = [];

  for (const version of versions) {
    const res = await probeProtocols(host, version, connection_timeout);
    connectedChecks.push(res);
  }

  return connectedChecks;
}

// export const check = async (host: string, connection_timeout: number) => {
//   const res = await checkConnections(host, connection_timeout);
//   console.log(res)
// }

// check("www.youtube.com", 10000);
