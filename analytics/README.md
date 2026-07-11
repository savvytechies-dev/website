# SavvyTechies — First-Party Website Analytics

Lightweight, cookieless, self-hosted visitor analytics with a **daily email report**.
No third-party trackers; all data stays in your AWS account.

## What it captures
- **Page views** (path, title, referrer)
- **Section / CTA clicks** (which `section[id]` and which element/label was clicked)
- **Visitor IP** — anonymized to /24 by default (last octet zeroed)
- **Geo** (country / region / city) via CloudFront edge headers
- **User-agent**, ephemeral per-tab session id (no cookies, `sessionStorage` only)

## Architecture
```
Browser (Layout.astro beacon)
   │  POST /collect   (navigator.sendBeacon, same-origin)
   ▼
CloudFront  ──/collect──▶  Collector Lambda (Function URL)
                                │ writes 1 JSON/event
                                ▼
                          S3  s3://savvytechies-analytics-events/events/dt=YYYY-MM-DD/
                                ▲
EventBridge (daily cron) ──▶ Reporter Lambda ──▶ SES email (HTML report)
```

## Files
| File | Purpose |
|---|---|
| `../src/layouts/Layout.astro` | client beacon (pageviews + click delegation) |
| `collector.mjs` | Function-URL Lambda: enrich (IP/geo/UA) + write to S3 |
| `reporter.mjs` | daily Lambda: aggregate yesterday + SES email |
| `deploy.sh` | provisions S3, IAM, both Lambdas, Function URL, daily schedule |

## Deploy
```bash
bash analytics/deploy.sh          # backend (S3, Lambdas, schedule)
# then wire /collect through CloudFront (see deploy.sh output) so the beacon reaches the collector
```

## The two decisions (easy to change)
- **IP handling** — `ANONYMIZE_IP` in `deploy.sh` (`true` = /24 anonymized, default; `false` = full IP → PII, requires a consent banner + privacy policy).
- **Report recipient** — `REPORT_RECIPIENT` in `deploy.sh` (default `govind.prathi@savvytechies.com`; comma-separate for multiple).

## Privacy notes
- Default is anonymized IP + no cookies + Do-Not-Track respected → low compliance burden.
- Raw events auto-expire after `EVENT_RETENTION_DAYS` (default 90) via S3 lifecycle.
- If you switch to full IPs, add a cookie/consent banner and a privacy policy, and shorten retention.

## Cost
Negligible for a marketing site: a few Lambda invocations, tiny S3, 1 SES email/day
(~$0.0001/day). Well under $1/month.
