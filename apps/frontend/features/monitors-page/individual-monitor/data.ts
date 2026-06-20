import { IndividualStatsCardProps, RegionMonitorProps } from "./types";

type IndividualStatsCardDataProps = { id: string } & IndividualStatsCardProps;

export const IndividualStatsCardData: IndividualStatsCardDataProps[] = [
  {
    id: crypto.randomUUID(),
    title: "Uptime (24h)",
    stats: "99.96%",
  },
  {
    id: crypto.randomUUID(),
    title: "Uptime (7d)",
    stats: "99.88%",
  },
  {
    id: crypto.randomUUID(),
    title: "Uptime (90d)",
    stats: "99.98%",
  },
  {
    id: crypto.randomUUID(),
    title: "Avg response",
    stats: "142ms",
  },
];

export const responseTimeHours = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:30",
];

export const responseTimeAvg = [
  155, 150, 148, 145, 158, 152, 145, 142,
  148, 152, 155, 158, 162, 158, 155, 152,
  155, 158, 162, 168, 175, 185, 200, 220,
];

export const responseTimeP95 = [
  278, 265, 270, 288, 275, 255, 248, 242,
  258, 265, 272, 275, 278, 272, 270, 268,
  272, 278, 290, 310, 340, 370, 400, 430,
];

type RegionLatencyProps = { id: string } & RegionMonitorProps;

export const RegionalLatencyStats: RegionLatencyProps[] = [
  {
    id: crypto.randomUUID(),
    region: "US-East",
    latency: "118ms",
    latencyMs: 118,
  },
  {
    id: crypto.randomUUID(),
    region: "US-West",
    latency: "142ms",
    latencyMs: 142,
  },
  {
    id: crypto.randomUUID(),
    region: "EU-West",
    latency: "161ms",
    latencyMs: 161,
  },
  {
    id: crypto.randomUUID(),
    region: "AP-South",
    latency: "233ms",
    latencyMs: 233,
  },
  {
    id: crypto.randomUUID(),
    region: "SA-East",
    latency: "287ms",
    latencyMs: 287,
  },
];
