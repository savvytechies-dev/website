#!/usr/bin/env bash
# Lock /collect to CloudFront only, and remove the vestigial Lambda Function URL.
#
# Mechanism: CloudFront injects a secret custom header (X-Origin-Secret) on every
# /collect origin request; the collector rejects requests without it. The secret is
# server-side only (never sent to browsers), so direct calls to the API Gateway URL
# are blocked. HTTP APIs have no native API keys — this is the standard equivalent.
#
# Rollout order avoids a data gap: deploy code (check dormant) -> add CF header +
# propagate -> set ORIGIN_SECRET (enforce) -> delete Function URL + OAC.
set -euo pipefail

REGION="us-east-1"
ACCOUNT="145554831595"
DIST="E3OEC4DI1YRJ40"
COLLECTOR="st-analytics-collector"
BUCKET="savvytechies-analytics-events"
ORIGIN_ID="analytics-collector"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
SECRET="$(openssl rand -hex 24)"

echo "==> 1/6 redeploy collector code (secret check present but dormant)"
zip -qj "$WORK/c.zip" "$(dirname "$0")/collector.mjs"
aws lambda update-function-code --function-name "$COLLECTOR" --zip-file "fileb://$WORK/c.zip" >/dev/null
aws lambda wait function-updated-v2 --function-name "$COLLECTOR"

echo "==> 2/6 add X-Origin-Secret custom header to the CloudFront /collect origin"
aws cloudfront get-distribution-config --id "$DIST" > "$WORK/d.json"
ETAG=$(jq -r .ETag "$WORK/d.json")
jq .DistributionConfig "$WORK/d.json" > "$WORK/cfg.json"
cp "$WORK/cfg.json" "$(dirname "$0")/cloudfront-config.backup.json"
jq --arg id "$ORIGIN_ID" --arg sec "$SECRET" '
  .Origins.Items |= map(if .Id==$id then
    (.CustomHeaders = {Quantity:1, Items:[{HeaderName:"X-Origin-Secret", HeaderValue:$sec}]})
  else . end)
' "$WORK/cfg.json" > "$WORK/new.json"
aws cloudfront update-distribution --id "$DIST" --if-match "$ETAG" \
  --distribution-config "file://$WORK/new.json" --query 'Distribution.Status' --output text

echo "==> 3/6 wait for CloudFront to propagate the header"
aws cloudfront wait distribution-deployed --id "$DIST"

echo "==> 4/6 enable enforcement (set ORIGIN_SECRET on the collector)"
aws lambda update-function-configuration --function-name "$COLLECTOR" \
  --environment "Variables={EVENTS_BUCKET=$BUCKET,ANONYMIZE_IP=true,ORIGIN_SECRET=$SECRET}" >/dev/null
aws lambda wait function-updated-v2 --function-name "$COLLECTOR"

echo "==> 5/6 delete the vestigial Function URL + its OAC permission"
aws lambda delete-function-url-config --function-name "$COLLECTOR" 2>/dev/null && echo "   function URL deleted" || echo "   (no function URL)"
aws lambda remove-permission --function-name "$COLLECTOR" --statement-id AllowCloudFrontOAC 2>/dev/null || true

echo "==> 6/6 delete the now-unused OAC"
OAC_ID=$(aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='st-analytics-collector-oac'].Id | [0]" --output text)
if [ "$OAC_ID" != "None" ] && [ -n "$OAC_ID" ]; then
  OAC_ETAG=$(aws cloudfront get-origin-access-control --id "$OAC_ID" --query ETag --output text)
  aws cloudfront delete-origin-access-control --id "$OAC_ID" --if-match "$OAC_ETAG" 2>/dev/null && echo "   deleted OAC $OAC_ID" || echo "   (OAC still referenced — skipped)"
fi

echo "DONE. /collect now requires the CloudFront-injected secret; direct API calls get 403."
