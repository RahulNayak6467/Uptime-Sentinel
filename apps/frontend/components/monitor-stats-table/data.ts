import { monitorDataProps } from "@/features/Overview/types";

// interval_seconds
//     :
//     60
// next_check_at
//     :
//     "2026-06-23T05:13:00.023Z"
// responseTime
//     :
//     undefined
// status
//     :
//     "UP"
// statusCode
//     :
//     200
// trend
//     :
//     (4) [0.25, 0.224, 0.241, 0.283]
// upTime
//     :
//     99.98
// url
//     :
//     "https://apple.com"
// url_name
//     :
//     "Test API"

export const servicesStatus: monitorDataProps[] = [
  {
    url_name: "Marketing Site",
    url: "https://uptimesentinel.io",
    uptime: 99.99,
    responseTime: 112,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "4s ago",
    status: "UP",
    trend: [
      0.4, 0.46, 0.52, 0.58, 0.62, 0.6, 0.54, 0.48, 0.42, 0.39, 0.43, 0.49,
      0.55, 0.6, 0.58, 0.52, 0.46, 0.42, 0.46, 0.52, 0.57, 0.6, 0.55, 0.49,
      0.44, 0.48,
    ],
  },
  {
    url_name: "App Dashboard",
    url: "https://app.uptimesentinel.io",
    uptime: 99.97,
    responseTime: 168,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "6s ago",
    status: "UP",
    trend: [
      0.2, 0.24, 0.22, 0.28, 0.31, 0.35, 0.33, 0.39, 0.43, 0.41, 0.47, 0.51,
      0.49, 0.55, 0.59, 0.57, 0.63, 0.67, 0.65, 0.71, 0.75, 0.73, 0.79, 0.83,
      0.81, 0.86,
    ],
  },
  {
    url_name: "API Gateway",
    url: "https://api.uptimesentinel.io/health",
    uptime: 99.95,
    responseTime: 88,
    statusCode: 200,
    interval_seconds: 15,
    next_check_at: "3s ago",
    status: "UP",
    trend: [
      0.72, 0.66, 0.6, 0.54, 0.47, 0.41, 0.35, 0.29, 0.24, 0.2, 0.23, 0.28,
      0.34, 0.4, 0.46, 0.52, 0.57, 0.61, 0.65, 0.69, 0.67, 0.63, 0.66, 0.69,
      0.67, 0.64,
    ],
  },
  {
    url_name: "Auth Service",
    url: "https://auth.uptimesentinel.io",
    uptime: 99.92,
    responseTime: 134,
    statusCode: 200,
    interval_seconds: 15,
    next_check_at: "8s ago",
    status: "UP",
    trend: [
      0.4, 0.75, 0.35, 0.8, 0.3, 0.7, 0.45, 0.85, 0.25, 0.65, 0.4, 0.78,
      0.32, 0.72, 0.5, 0.82, 0.3, 0.68, 0.42, 0.76, 0.36, 0.7, 0.48, 0.8,
      0.34, 0.66,
    ],
  },
  {
    url_name: "Checkout Service",
    url: "https://checkout.uptimesentinel.io",
    uptime: 98.41,
    responseTime: 503,
    statusCode: 503,
    interval_seconds: 15,
    next_check_at: "2s ago",
    status: "DOWN",
    trend: [
      0.3, 0.28, 0.32, 0.29, 0.31, 0.27, 0.3, 0.33, 0.29, 0.31, 0.28, 0.34,
      0.36, 0.42, 0.55, 0.68, 0.82, 0.9, 0.95, 0.92, 0.88, 0.85, 0.89, 0.93,
      0.9, 0.94,
    ],
  },
  {
    url_name: "Payments Webhook",
    url: "https://api.uptimesentinel.io/webhooks/payments",
    uptime: 99.88,
    responseTime: 224,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "11s ago",
    status: "UP",
    trend: [
      0.3, 0.5, 0.72, 0.34, 0.55, 0.76, 0.38, 0.6, 0.8, 0.42, 0.3, 0.52,
      0.74, 0.36, 0.58, 0.78, 0.4, 0.3, 0.54, 0.75, 0.38, 0.6, 0.8, 0.44,
      0.32, 0.56,
    ],
  },
  {
    url_name: "Search API",
    url: "https://search.uptimesentinel.io",
    uptime: 99.9,
    responseTime: 176,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "5s ago",
    status: "UP",
    trend: [
      0.4, 0.42, 0.38, 0.41, 0.4, 0.43, 0.41, 0.9, 0.84, 0.58, 0.48, 0.43,
      0.4, 0.42, 0.41, 0.39, 0.43, 0.4, 0.42, 0.38, 0.41, 0.4, 0.42, 0.39,
      0.41, 0.4,
    ],
  },
  {
    url_name: "CDN Images",
    url: "https://cdn.uptimesentinel.io/images",
    uptime: 99.99,
    responseTime: 54,
    statusCode: 200,
    interval_seconds: 60,
    next_check_at: "14s ago",
    status: "DOWN",
    trend: [
      0.82, 0.8, 0.84, 0.76, 0.72, 0.74, 0.67, 0.62, 0.58, 0.6, 0.54, 0.5,
      0.46, 0.48, 0.42, 0.38, 0.34, 0.36, 0.3, 0.28, 0.32, 0.26, 0.24, 0.27,
      0.22, 0.2,
    ],
  },
  {
    url_name: "Postgres Primary",
    url: "tcp://db-primary.uptimesentinel.io:5432",
    uptime: 99.98,
    responseTime: 38,
    statusCode: 200,
    interval_seconds: 15,
    next_check_at: "2s ago",
    status: "UP",
    trend: [
      0.7, 0.64, 0.56, 0.48, 0.4, 0.33, 0.28, 0.25, 0.24, 0.26, 0.3, 0.36,
      0.43, 0.5, 0.57, 0.63, 0.68, 0.7, 0.69, 0.66, 0.62, 0.64, 0.67, 0.65,
      0.62, 0.6,
    ],
  },
  {
    url_name: "Redis Cache",
    url: "tcp://redis.uptimesentinel.io:6379",
    uptime: 99.99,
    responseTime: 16,
    statusCode: 200,
    interval_seconds: 15,
    next_check_at: "1s ago",
    status: "UP",
    trend: [
      0.35, 0.5, 0.38, 0.52, 0.4, 0.54, 0.42, 0.56, 0.44, 0.58, 0.4, 0.55,
      0.42, 0.57, 0.44, 0.6, 0.46, 0.58, 0.43, 0.56, 0.41, 0.54, 0.39, 0.52,
      0.37, 0.5,
    ],
  },
  {
    url_name: "Webhooks Dispatcher",
    url: "https://api.uptimesentinel.io/dispatch",
    uptime: 99.84,
    responseTime: 252,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "9s ago",
    status: "UP",
    trend: [
      0.28, 0.32, 0.38, 0.45, 0.52, 0.59, 0.65, 0.69, 0.7, 0.69, 0.71, 0.7,
      0.68, 0.7, 0.71, 0.69, 0.7, 0.72, 0.7, 0.69, 0.71, 0.7, 0.69, 0.71,
      0.7, 0.7,
    ],
  },
  {
    url_name: "Email Service",
    url: "https://mail.uptimesentinel.io",
    uptime: 99.76,
    responseTime: 268,
    statusCode: 200,
    interval_seconds: 60,
    next_check_at: "18s ago",
    status: "UP",
    trend: [
      0.3, 0.45, 0.6, 0.72, 0.78, 0.68, 0.52, 0.38, 0.3, 0.34, 0.46, 0.6,
      0.74, 0.82, 0.76, 0.62, 0.48, 0.36, 0.3, 0.4, 0.54, 0.66, 0.6, 0.48,
      0.38, 0.44,
    ],
  },
  {
    url_name: "Analytics Ingest",
    url: "https://ingest.uptimesentinel.io",
    uptime: 99.93,
    responseTime: 142,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "7s ago",
    status: "UP",
    trend: [
      0.3, 0.3, 0.31, 0.3, 0.55, 0.56, 0.55, 0.54, 0.56, 0.8, 0.81, 0.8,
      0.79, 0.8, 0.55, 0.54, 0.56, 0.55, 0.3, 0.31, 0.3, 0.55, 0.56, 0.8,
      0.79, 0.8,
    ],
  },
  {
    url_name: "Mobile API",
    url: "https://mobile.uptimesentinel.io/v2",
    uptime: 99.91,
    responseTime: 198,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "5s ago",
    status: "UP",
    trend: [
      0.7, 0.65, 0.6, 0.54, 0.49, 0.45, 0.41, 0.37, 0.33, 0.3, 0.32, 0.28,
      0.31, 0.34, 0.3, 0.32, 0.29, 0.35, 0.42, 0.52, 0.66, 0.82, 0.9, 0.7,
      0.55, 0.6,
    ],
  },
  {
    url_name: "Status Page",
    url: "https://status.uptimesentinel.io",
    uptime: 100.0,
    responseTime: 72,
    statusCode: 200,
    interval_seconds: 60,
    next_check_at: "21s ago",
    status: "UP",
    trend: [
      0.42, 0.43, 0.45, 0.44, 0.46, 0.48, 0.47, 0.49, 0.5, 0.49, 0.51, 0.52,
      0.51, 0.53, 0.54, 0.53, 0.55, 0.56, 0.55, 0.57, 0.58, 0.57, 0.59, 0.6,
      0.59, 0.61,
    ],
  },
  {
    url_name: "Docs",
    url: "https://docs.uptimesentinel.io",
    uptime: 99.97,
    responseTime: 104,
    statusCode: 200,
    interval_seconds: 60,
    next_check_at: "33s ago",
    status: "UP",
    trend: [
      0.3, 0.35, 0.42, 0.5, 0.58, 0.67, 0.75, 0.81, 0.84, 0.81, 0.75, 0.67,
      0.58, 0.5, 0.42, 0.35, 0.3, 0.33, 0.39, 0.46, 0.4, 0.35, 0.31, 0.35,
      0.4, 0.36,
    ],
  },
  {
    url_name: "Blog",
    url: "https://blog.uptimesentinel.io",
    uptime: 99.99,
    responseTime: 126,
    statusCode: 200,
    interval_seconds: 60,
    next_check_at: "29s ago",
    status: "UP",
    trend: [
      0.45, 0.62, 0.5, 0.38, 0.66, 0.54, 0.34, 0.5, 0.72, 0.44, 0.6, 0.4,
      0.55, 0.7, 0.42, 0.5, 0.64, 0.36, 0.56, 0.72, 0.48, 0.4, 0.62, 0.52,
      0.44, 0.58,
    ],
  },
  {
    url_name: "Admin Console",
    url: "https://admin.uptimesentinel.io",
    uptime: 99.89,
    responseTime: 182,
    statusCode: 200,
    interval_seconds: 30,
    next_check_at: "12s ago",
    status: "UNKNOWN",
    trend: [
      0.2, 0.26, 0.34, 0.43, 0.53, 0.63, 0.73, 0.82, 0.9, 0.85, 0.77, 0.67,
      0.57, 0.47, 0.38, 0.3, 0.24, 0.2, 0.25, 0.31, 0.27, 0.23, 0.28, 0.33,
      0.28, 0.24,
    ],
  },
  {
    url_name: "Support Portal",
    url: "https://support.uptimesentinel.io",
    uptime: 99.94,
    responseTime: 214,
    statusCode: 200,
    interval_seconds: 60,
    next_check_at: "16s ago",
    status: "UNKNOWN",
    trend: [
      0.5, 0.49, 0.51, 0.48, 0.52, 0.47, 0.54, 0.45, 0.57, 0.42, 0.61, 0.38,
      0.65, 0.34, 0.7, 0.3, 0.74, 0.26, 0.78, 0.22, 0.82, 0.2, 0.84, 0.25,
      0.8, 0.3,
    ],
  },
  {
    url_name: "Staging API",
    url: "https://staging-api.uptimesentinel.io",
    uptime: 97.2,
    responseTime: null,
    statusCode: null,
    interval_seconds: 60,
    next_check_at: "Paused",
    status: "UNKNOWN",
    trend: [],
  },
  {
    url_name: "Internal Cron",
    url: "https://cron.uptimesentinel.io",
    uptime: 99.5,
    responseTime: null,
    statusCode: null,
    interval_seconds: 300,
    next_check_at: "Paused",
    status: "UNKNOWN",
    trend: [],
  },
];