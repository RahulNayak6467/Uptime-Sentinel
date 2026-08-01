// import { checkDeprecatedProtocol } from "../deriveTls";

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: true }, { name: "TLSv1.2", enabled: true },
//   { name: "TLSv1.1", enabled: false }, { name: "TLSv1", enabled: false },
// ]).then((r) => console.log("1", r, "expected Pass"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: true }, { name: "TLSv1.2", enabled: true },
//   { name: "TLSv1.1", enabled: true }, { name: "TLSv1", enabled: false },
// ]).then((r) => console.log("2", r, "expected Fail"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: true }, { name: "TLSv1.2", enabled: true },
//   { name: "TLSv1.1", enabled: false }, { name: "TLSv1", enabled: true },
// ]).then((r) => console.log("3", r, "expected Fail"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: true }, { name: "TLSv1.2", enabled: true },
//   { name: "TLSv1.1", enabled: true }, { name: "TLSv1", enabled: true },
// ]).then((r) => console.log("4", r, "expected Fail"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: true }, { name: "TLSv1.2", enabled: true },
//   { name: "TLSv1.1", enabled: true },
// ]).then((r) => console.log("5", r, "expected Fail"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1", enabled: true }, { name: "TLSv1.1", enabled: false },
//   { name: "TLSv1.2", enabled: true }, { name: "TLSv1.3", enabled: true },
// ]).then((r) => console.log("6", r, "expected Fail"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: false }, { name: "TLSv1.2", enabled: false },
//   { name: "TLSv1.1", enabled: true }, { name: "TLSv1", enabled: false },
// ]).then((r) => console.log("7", r, "expected Fail"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: true }, { name: "TLSv1.2", enabled: false },
//   { name: "TLSv1.1", enabled: false }, { name: "TLSv1", enabled: false },
// ]).then((r) => console.log("8", r, "expected Pass"));

// checkDeprecatedProtocol("test", 0, [
//   { name: "TLSv1.3", enabled: false }, { name: "TLSv1.2", enabled: false },
//   { name: "TLSv1.1", enabled: false }, { name: "TLSv1", enabled: false },
// ]).then((r) => console.log("9", r, "expected Pass"));

// checkDeprecatedProtocol("test", 0, []).then((r) => console.log("10", r, "expected Pass"));
