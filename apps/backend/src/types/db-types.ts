export interface overViewStatsProps {
total_checks: string
avg_total_checks: string | null
up_count: string
down_count: string
total_monitors: string | null
paused_monitors: string
}

export interface uptimeStatsProps {
    uptime_percentage: string | null
}

export interface individualStatsProps {
    uptime_24hr: string | null
    uptime_7d:string | null
    uptime_30d: string | null
    avg_response_24hr: string | null
}