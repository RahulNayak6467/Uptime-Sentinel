import {responseTimeProps} from "../types/types";

export const timeRangeData = new Map<string,responseTimeProps>()
timeRangeData.set("1h",{window: "1 hour",bucket:"minute",step:"5 minutes"})
timeRangeData.set("24h",{ window: '24 hours', bucket: 'hour', step: '1 hour'})
timeRangeData.set("7d",{ window: '7 days', bucket: 'hour', step: '6 hours'})
timeRangeData.set("30d", { window: '30 days', bucket: 'day', step: '1 day' })

export const tlsTimeRangeData = new Map<string, responseTimeProps>();
tlsTimeRangeData.set("7d", { window: "7 days", bucket: "day", step: "1day" });
tlsTimeRangeData.set("30d", { window: "30 days", bucket: "day", step: "1 day" });
tlsTimeRangeData.set("90d", { window: "90 days", bucket: "day", step: "3 days" });
tlsTimeRangeData.set("1y", { window: "1 year", bucket: "week", step: "1 week" });
