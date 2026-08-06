import { resolveCaa } from "node:dns/promises";
import type { CaaRecord } from "node:dns";
import { ComputeCaa } from "./tls.types";

// Injectable so tests can feed fake records / errors without hitting real DNS.
type CaaLookup = (host: string) => Promise<CaaRecord[]>;

// resolveCaa has no built-in timeout, so a dead resolver could hang the check.
// Race the lookup against a timer and always clear the timer afterwards.
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("caa_timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

/**
 * Look up the domain's CAA policy for the Revocation card.
 *
 * This does NOT verify the current certificate against CAA (that is the CA's job
 * at issuance). It reports whether an issuance policy EXISTS and what it permits:
 *   - Pass    → a CAA record is present (issuers named, or an explicit deny-all)
 *   - Warn    → no CAA record (ENODATA/ENOTFOUND) → any CA may issue
 *   - Unknown → the lookup itself failed (timeout / SERVFAIL) → cannot say
 *
 * `caaPresent` disambiguates the two empty-`allowedIssuers` cases:
 *   deny-all (`issue ";"`, present=true) vs no-record (present=false).
 */
export const computeCaa = async (
  host: string,
  connection_timeout: number,
  lookup: CaaLookup = (h) => withTimeout(resolveCaa(h), connection_timeout),
): Promise<ComputeCaa> => {
  try {
    const records = await lookup(host);
    const caaPresent = records.length > 0;

    // issue + issuewild are both authorized-CA entries. A lone ";" is the
    // deny-all marker, not an issuer — drop it so the list is empty for deny-all.
    const allowedIssuers = records
      .map((record) => record.issue ?? record.issuewild)
      .filter((value): value is string => value !== undefined && value.trim() !== ";");

    const iodef = records
      .map((record) => record.iodef)
      .filter((value): value is string => value !== undefined);

    return {
      status: caaPresent ? "Pass" : "Warn",
      caaPresent,
      allowedIssuers,
      iodef,
    };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;

    // Host resolves but has no CAA record → confirmed permissive (any CA).
    if (code === "ENODATA" || code === "ENOTFOUND") {
      return { status: "Warn", caaPresent: false, allowedIssuers: [], iodef: [] };
    }

    // Timeout / SERVFAIL / anything else → we could not determine the policy.
    return { status: "Unknown", caaPresent: false, allowedIssuers: [], iodef: [] };
  }
};
