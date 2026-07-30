import { REFRESH_MS } from "../../constants/constants";
import { CtLogMap, LogListResponse } from "./tls.types";

const LOG_LIST_URL = "https://www.gstatic.com/ct/log_list/v3/log_list.json";

let cache: { map: CtLogMap; fetchedAt: number } | null = null;

const buildMap = (data: LogListResponse): CtLogMap => {
  const map: CtLogMap = new Map();
  for (const operator of data.operators) {
    for (const log of operator.logs) {
      map.set(log.log_id, log.description ?? operator.name);
    }
  }
  return map;
};


export const getCtLogMap = async (): Promise<CtLogMap> => {
  if (cache && Date.now() - cache.fetchedAt < REFRESH_MS) return cache.map;

  try {
    const res = await fetch(LOG_LIST_URL);
    if (!res.ok) throw new Error(`CT log list fetch failed: ${res.status}`);
    const data = (await res.json()) as LogListResponse;
    cache = { map: buildMap(data), fetchedAt: Date.now() };
    return cache.map;
  } catch {
    return cache?.map ?? new Map();
  }
};
