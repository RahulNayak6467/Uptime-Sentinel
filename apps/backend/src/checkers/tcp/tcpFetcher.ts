// import tls from "node:tls";
let tls;

try {
  tls =  import('node:tls');
}
catch (err) {
  console.error('tls support is disabled!');
}

const socket = tls.connect({
  host: "www.youtube.com",
  port: 443,
  servername: "www.youtube.com"
})

const certificate = socket.getPeerCertificate(true);
