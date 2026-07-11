// Analytics collector — Lambda behind a Function URL, fronted by CloudFront at /collect.
// Receives beacon events from the site, enriches with IP (anonymized by default) +
// CloudFront geo headers, and appends one JSON object per event to S3.
//
// Env:
//   EVENTS_BUCKET   S3 bucket for raw events (required)
//   ANONYMIZE_IP    "false" to store full IPs; anything else (default) anonymizes
//
// It NEVER returns an error to the browser — analytics must not break the site.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});
const BUCKET = process.env.EVENTS_BUCKET;
const ANONYMIZE = process.env.ANONYMIZE_IP !== 'false';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Zero the last IPv4 octet / truncate IPv6 to /48 — keeps country/city accurate,
// drops the host-identifying bits. GDPR/CCPA-friendly.
function anonymize(ip) {
  if (!ip) return null;
  if (ip.includes('.')) { const p = ip.split('.'); p[3] = '0'; return p.join('.'); }
  if (ip.includes(':')) { const p = ip.split(':'); return p.slice(0, 3).join(':') + '::'; }
  return ip;
}

export const handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === 'OPTIONS') {
      return { statusCode: 204, headers: cors, body: '' };
    }
    let body = event.body || '';
    if (event.isBase64Encoded) body = Buffer.from(body, 'base64').toString('utf8');
    const data = body ? JSON.parse(body) : {};
    const h = event.headers || {};

    // CloudFront-Viewer-Address is "IP:port"; fall back to XFF / sourceIp.
    const rawIp =
      (h['cloudfront-viewer-address'] || '').replace(/:\d+$/, '') ||
      (h['x-forwarded-for'] || '').split(',')[0].trim() ||
      event.requestContext?.http?.sourceIp ||
      null;

    const now = new Date();
    const rec = {
      type: data.type || 'unknown',
      path: typeof data.path === 'string' ? data.path.slice(0, 256) : null,
      section: typeof data.section === 'string' ? data.section.slice(0, 64) : null,
      label: typeof data.label === 'string' ? data.label.slice(0, 96) : null,
      tag: typeof data.tag === 'string' ? data.tag.slice(0, 16) : null,
      href: typeof data.href === 'string' ? data.href.slice(0, 256) : null,
      ref: typeof data.ref === 'string' ? data.ref.slice(0, 256) : null,
      title: typeof data.title === 'string' ? data.title.slice(0, 160) : null,
      sid: typeof data.sid === 'string' ? data.sid.slice(0, 64) : null,
      ts: Number.isFinite(data.ts) ? data.ts : now.getTime(),
      ip: ANONYMIZE ? anonymize(rawIp) : rawIp,
      country: h['cloudfront-viewer-country'] || null,
      region: h['cloudfront-viewer-country-region-name'] || h['cloudfront-viewer-country-region'] || null,
      city: h['cloudfront-viewer-city'] || null,
      ua: (h['user-agent'] || '').slice(0, 256) || null,
    };

    const dt = now.toISOString().slice(0, 10); // partition by UTC day
    const key = `events/dt=${dt}/${now.getTime()}-${Math.random().toString(36).slice(2, 10)}.json`;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: key,
      Body: JSON.stringify(rec), ContentType: 'application/json',
    }));

    return { statusCode: 204, headers: cors, body: '' };
  } catch (_) {
    return { statusCode: 204, headers: cors, body: '' };
  }
};
