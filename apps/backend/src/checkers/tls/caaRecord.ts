import { CaaRecord, promises as dns } from "node:dns";

export const caaResolve = async (host: string) => {
  try {
    const records = await dns.resolveCaa(host);

    const issuers: CaaRecord[] = records.filter((el) => el.issue !== undefined || el.issuewild !== undefined);

    const allowedIssuers = issuers.map((el) => el.issue ? el.issue : el.iodef);
  }
  catch (err) {

  }
}
