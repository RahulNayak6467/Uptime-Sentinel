# Settings Page — Design Reference

Frontend settings page for StatusForge. Built 2026-08-07 as a design (presentational;
not wired to backend). **Single-user product** — no workspaces/teams/billing/SSO/
on-call/recipients anywhere. Designed for the full **V7→V18** roadmap: V7 sections
fully built, later-version sections rendered as coming-soon.

## Status
- **NOT committed** (per dev).
- **Presentational only** — Toggles self-manage local state, selects use
  `defaultValue`. Needs react-hook-form + create/update APIs to wire.
- **Phase 1 (V7)** = fully built. **Phase 2 (later versions)** = built + **accessible
  now for review**; once dev approves, **LOCK them** (make inaccessible / coming-soon
  gated). Nav already shows a "Soon" badge on Phase-2 items (via `comingSoon` in
  `features/settings/data.ts`).
- Sidebar **Settings** button wired to `/dashboard/settings`
  (`components/sidebar/data.ts`, `comingSoon` removed).

## File structure (`features/settings/`)
```
types.ts                       SettingsSectionId (10 ids) + nav types
data.ts                        nav groups + all select-option arrays + monitorTypeTabs
components/
  form-controls.tsx            SettingCard, Field, SettingRow, Toggle, TextInput,
                               SelectInput, SegmentedControl, Pill, Primary/GhostButton
  settings-nav.tsx             left sidebar (grouped, "Soon" badges)
  settings-page.tsx            shell: nav + content + exhaustive section switch
  sections/                    one file per section (10)
app/(protected)/dashboard/settings/page.tsx   route → <SettingsPage/>
```

## Nav groups (single-user)
- **General:** Account
- **Monitoring:** Monitoring defaults
- **Alerting:** Notifications · Escalation (soon) · Maintenance (soon)
- **Access:** Security (soon) · API & webhooks (soon)
- **Public:** Probe regions (soon, V12) · Status page (soon) · Integrations (soon)

## Phase 1 — built (V7)
- **Account:** Profile (name, email, timezone, date format, theme) · Password
  (current/new/confirm) · Danger zone (delete account).
- **Monitoring defaults:** SegmentedControl tabs **HTTP · TCP · TLS · DNS**.
  - Common "Check defaults": interval *(fast lane 30s–1h for HTTP/TCP; slow lane
    1h–24h for TLS/DNS)*, timeout, retries, retry delay, data retention.
  - Type-specific: HTTP (status codes, response-time threshold, follow redirects);
    TCP (note — uses common, port per-monitor); TLS (expiry alert thresholds, verify
    cert, min TLS version, expiry warning); DNS (default record type, alert on change).
  - Incident thresholds: mark down / mark up.
- **Notifications:**
  - Delivery channels: Email (active) + Slack/Webhook/SMS/Discord (soon) + "Send test
    alert".
  - Alert rules: **tabbed by type** (HTTP/TCP/TLS/DNS) — catalogs mirror the
    individual-monitor design files (tcp/dns/certificates-monitor.tsx). Off-by-default:
    TCP address-changed, TLS pin-broken, DNS record-left-allowlist + email-auth.
  - Delivery preferences: reminder cadence · group related alerts · daily digest ·
    quiet hours (toggle + active days + from/to). Folded from the `email-alerts` feature.

## Phase 2 — built, accessible for review (LOCK after approval)
- **Escalation:** re-alert tiers (immediately → after 5m → after 15m, per channel) +
  ack-stops-chain note. No on-call rotation (team).
- **Maintenance:** windows list + defaults (suppress alerts, exclude from uptime,
  advance notice).
- **Security:** 2FA (TOTP + recovery codes) · active sessions (sign out everywhere) ·
  export my data. **Audit log removed** (enterprise/compliance). No SSO/SCIM/IP-allowlist.
- **API & webhooks:** API keys (list/create/rotate/revoke) · webhook signing secret ·
  retries · docs.
- **Probe regions (V12):** region enable/disable list + failure confirmation (region
  quorum, notification delay, ignore single-region).
- **Status page:** visibility radios (public/password/private) · custom domain ·
  appearance (theme, uptime history, show uptime%/response-times/maintenance) ·
  subscribers (email/RSS).
- **Integrations:** Slack · Webhook · Discord · PagerDuty · Opsgenie · Jira · Grafana
  · Datadog. All alert-outbound = simple REST POST; Jira = moderate (issue creation).

## Decisions locked (do not re-litigate)
- Single-user → cut teams/members/billing/SSO/SCIM/transfer/recipients/on-call.
- Monitoring defaults & alert rules **tabbed by monitor type**.
- TLS/DNS interval options are **hours-scale** (`tlsCheckIntervals`/slow lane).
- `enabled_alerts` NOT in the create form — defaults + managed here in settings.
- Integrations include PagerDuty/Opsgenie/Jira (easy REST) despite being team-ish —
  dev opted in 2026-08-07.
- Excluded (evaluated, not missed): SLO targets, custom health rules, status-page
  component picker, snooze-all, alert from/reply-to, DKIM validation.
- Profile picture (avatar) upload **un-excluded 2026-08-07** — dev scoped it to V8
  (reuses S3 report storage). Built into Account → Profile (upload/remove + hint);
  tracked in `v8.md`.

## Remaining work
1. **Lock Phase 2** sections after dev approval (gate as inaccessible/coming-soon).
2. **Backend wiring** — replace presentational state with react-hook-form + APIs when
   each section's backend lands (per version).
3. Not committed — dev decides when.
