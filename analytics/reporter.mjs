// Analytics daily reporter — Lambda triggered by an EventBridge daily schedule.
// Reads yesterday's raw events from S3, aggregates, and emails an HTML report via SES.
//
// Env:
//   EVENTS_BUCKET     S3 bucket with raw events (required)
//   REPORT_SENDER     verified SES sender, e.g. reports@savvytechies.com (required)
//   REPORT_RECIPIENT  comma-separated recipients (required)
//   REPORT_TZ_OFFSET  hours offset from UTC for the "day" boundary (default 0)

import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const s3 = new S3Client({});
const ses = new SESv2Client({});
const BUCKET = process.env.EVENTS_BUCKET;
const SENDER = process.env.REPORT_SENDER;
const RECIPIENTS = (process.env.REPORT_RECIPIENT || '').split(',').map((s) => s.trim()).filter(Boolean);
const TZ_OFFSET = parseInt(process.env.REPORT_TZ_OFFSET || '0', 10);

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function readDay(dt) {
  const events = [];
  let token;
  do {
    const out = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: `events/dt=${dt}/`, ContinuationToken: token,
    }));
    for (const obj of out.Contents || []) {
      const g = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
      try { events.push(JSON.parse(await g.Body.transformToString())); } catch (_) { /* skip */ }
    }
    token = out.IsTruncated ? out.NextContinuationToken : undefined;
  } while (token);
  return events;
}

const top = (map, n = 10) =>
  [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

function buildReport(dt, events) {
  const pv = events.filter((e) => e.type === 'pageview');
  const clicks = events.filter((e) => e.type === 'click');
  const visitors = new Set(events.map((e) => e.ip).filter(Boolean));
  const sessions = new Set(events.map((e) => e.sid).filter(Boolean));

  const tally = (arr, keyFn) => {
    const m = new Map();
    for (const e of arr) { const k = keyFn(e); if (k) m.set(k, (m.get(k) || 0) + 1); }
    return m;
  };
  const pages = tally(pv, (e) => e.path);
  const sections = tally(clicks, (e) => e.section || '(none)');
  const clicked = tally(clicks, (e) => `${e.label || e.tag} ${e.href ? '→ ' + e.href : ''}`.trim());
  const countries = tally(events, (e) => e.country);
  const refs = tally(pv, (e) => { try { return e.ref ? new URL(e.ref).hostname : '(direct)'; } catch { return '(direct)'; } });
  const ips = tally(events, (e) => e.ip);

  const rows = (pairs, cols) => pairs.length
    ? pairs.map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(k)}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600">${v}</td></tr>`).join('')
    : `<tr><td colspan="2" style="padding:6px 12px;color:#999">No data</td></tr>`;

  const section = (title, pairs) => `
    <h3 style="margin:24px 0 8px;font-size:15px;color:#111">${title}</h3>
    <table style="border-collapse:collapse;width:100%;font-size:13px">${rows(pairs)}</table>`;

  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#222;max-width:640px;margin:0 auto;padding:24px">
    <h2 style="margin:0 0 4px">SavvyTechies — Daily Traffic Report</h2>
    <p style="color:#666;margin:0 0 16px">${esc(dt)}</p>
    <table style="border-collapse:collapse;width:100%;margin-bottom:8px">
      <tr>
        <td style="padding:12px;background:#f5f7ff;border-radius:8px;text-align:center"><div style="font-size:24px;font-weight:700;color:#3b5bdb">${visitors.size}</div><div style="font-size:12px;color:#666">Unique visitors</div></td>
        <td style="width:8px"></td>
        <td style="padding:12px;background:#f5f7ff;border-radius:8px;text-align:center"><div style="font-size:24px;font-weight:700;color:#3b5bdb">${pv.length}</div><div style="font-size:12px;color:#666">Page views</div></td>
        <td style="width:8px"></td>
        <td style="padding:12px;background:#f5f7ff;border-radius:8px;text-align:center"><div style="font-size:24px;font-weight:700;color:#3b5bdb">${clicks.length}</div><div style="font-size:12px;color:#666">Clicks</div></td>
        <td style="width:8px"></td>
        <td style="padding:12px;background:#f5f7ff;border-radius:8px;text-align:center"><div style="font-size:24px;font-weight:700;color:#3b5bdb">${sessions.size}</div><div style="font-size:12px;color:#666">Sessions</div></td>
      </tr>
    </table>
    ${section('Top pages', top(pages))}
    ${section('Sections clicked', top(sections))}
    ${section('Top elements clicked', top(clicked))}
    ${section('Countries', top(countries))}
    ${section('Referrers', top(refs))}
    ${section('Top visitor IPs (anonymized)', top(ips))}
    <p style="color:#999;font-size:11px;margin-top:24px">First-party analytics • IPs anonymized to /24 • ${events.length} raw events</p>
  </body></html>`;

  const subject = `SavvyTechies traffic — ${dt}: ${visitors.size} visitors, ${pv.length} views`;
  return { subject, html };
}

export const handler = async () => {
  // "Yesterday" in the configured timezone.
  const d = new Date(Date.now() + TZ_OFFSET * 3600 * 1000 - 24 * 3600 * 1000);
  const dt = d.toISOString().slice(0, 10);
  const events = await readDay(dt);
  const { subject, html } = buildReport(dt, events);

  await ses.send(new SendEmailCommand({
    FromEmailAddress: SENDER,
    Destination: { ToAddresses: RECIPIENTS },
    Content: { Simple: { Subject: { Data: subject }, Body: { Html: { Data: html } } } },
  }));
  return { statusCode: 200, dt, events: events.length };
};
