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
CloudFront ──/collect──▶ API Gateway (HTTP API) ──▶ Collector Lambda
                          (forwards geo headers)        │ writes 1 JSON/event
                                                        ▼
                          S3  s3://savvytechies-analytics-events/events/dt=YYYY-MM-DD/
                                ▲
EventBridge (daily cron) ──▶ Reporter Lambda ──▶ SES email (HTML report)
```
> Transport note: we front the collector with a **public API Gateway HTTP API**, not
> the Lambda Function URL. CloudFront OAC → Function URL can't sign POST bodies
> (`InvalidSignatureException`), so a beacon with a JSON body fails under OAC. API
> Gateway needs no request signing and still receives the CloudFront geo headers.

## Access control (/collect locked to CloudFront)
The API Gateway URL is public, so to stop direct/forged posts CloudFront injects a
secret **`X-Origin-Secret`** custom header on every `/collect` origin request, and the
collector rejects (403) any request missing it. The secret is server-side only (added
CloudFront→origin, never exposed to browsers). HTTP APIs have no native API keys — this
header-secret is the standard equivalent. Run `restrict-and-cleanup.sh` to apply it and
delete the vestigial Function URL. Rotate by re-running the script (new random secret).

## Files
| File | Purpose |
|---|---|
| `../src/layouts/Layout.astro` | client beacon (pageviews + click delegation) |
| `collector.mjs` | Lambda: enrich (IP/geo/UA) + write to S3 (HTTP API v2.0 event) |
| `reporter.mjs` | daily Lambda: aggregate yesterday + SES email |
| `deploy.sh` | provisions S3, IAM, both Lambdas, daily schedule |
| `switch-to-apigw.sh` | creates the HTTP API and points CloudFront `/collect` at it |
| `restrict-and-cleanup.sh` | locks `/collect` to CloudFront (secret header) + deletes Function URL |

## Deploy
```bash
bash analytics/deploy.sh            # backend (S3, Lambdas, schedule)
bash analytics/switch-to-apigw.sh   # HTTP API + wire CloudFront /collect (touches prod dist)
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
