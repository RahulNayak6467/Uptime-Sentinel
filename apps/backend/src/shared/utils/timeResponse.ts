import {responseTimeProps} from "../types/types";

export const timeRangeData = new Map<string,responseTimeProps>()
timeRangeData.set("1h",{window: "1 hour",bucket:"minute",step:"5 minutes"})
timeRangeData.set("24h",{ window: '24 hours', bucket: 'hour', step: '1 hour'})
timeRangeData.set("7d",{ window: '7 days', bucket: 'hour', step: '6 hours'})
timeRangeData.set("30d",{ window: '30 days',  bucket: 'day',  step: '1 day'})