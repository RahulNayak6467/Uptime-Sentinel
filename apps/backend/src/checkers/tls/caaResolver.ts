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
// Build the CAA tree-climb: the exact name, then each parent up to the
// registrable domain (RFC 8659 §3 — CAA is inherited from the closest ancestor
// that has a record). Stop at 2 labels; querying the TLD/public suffix (e.g.
// "com") never carries CAA. The 2-label rule is slightly off for multi-label
// suffixes like ".co.uk" (stops at "co.uk"), but climbing one level too far
// there is harmless — it just returns empty.
const climbNames = (host: string): string[] => {
  const labels = host.split(".");
  const names: string[] = [];
  for (let i = 0; i <= labels.length - 2; i++) {
    names.push(labels.slice(i).join("."));
  }
  return names;
};

export const computeCaa = async (
  host: string,
  connection_timeout: number,
  lookup: CaaLookup = (h) => withTimeout(resolveCaa(h), connection_timeout),
): Promise<ComputeCaa> => {
  // Walk up (www.example.com → example.com) until we find a record or run out.
  for (const name of climbNames(host)) {
    try {
      const records = await lookup(name);

      // No policy at this level → climb to the parent.
      if (records.length === 0) continue;

      // issue + issuewild are both authorized-CA entries. A lone ";" is the
      // deny-all marker, not an issuer — drop it so the list is empty for deny-all.
      const allowedIssuers = records
        .map((record) => record.issue ?? record.issuewild)
        .filter((value): value is string => value !== undefined && value.trim() !== ";");

      const iodef = records
        .map((record) => record.iodef)
        .filter((value): value is string => value !== undefined);

      return { status: "Pass", caaPresent: true, allowedIssuers, iodef };
    } catch (err) {
      const code = (err as NodeJS.ErrnoException)?.code;

      // No CAA record at this name → treat like empty and climb to the parent.
      if (code === "ENODATA" || code === "ENOTFOUND") continue;

      // Timeout / SERVFAIL / anything else → we could not determine the policy.
      return { status: "Unknown", caaPresent: false, allowedIssuers: [], iodef: [] };
    }
  }

  // Climbed to the registrable domain and found nothing → confirmed permissive.
  return { status: "Warn", caaPresent: false, allowedIssuers: [], iodef: [] };
};
