#!/usr/bin/env bash
# Fix: OAC -> Lambda Function URL can't sign POST bodies (InvalidSignatureException).
# Swap the CloudFront /collect origin to a PUBLIC API Gateway HTTP API in front of the
# same collector Lambda. Keeps same-origin /collect + CloudFront geo headers; POST works.
# Collector code is unchanged (HTTP API payload v2.0 == Function URL event shape).
set -euo pipefail

REGION="us-east-1"
ACCOUNT="145554831595"
DIST="E3OEC4DI1YRJ40"
COLLECTOR="st-analytics-collector"
API_NAME="st-analytics-api"
ORIGIN_ID="analytics-collector"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
COLLECTOR_ARN="arn:aws:lambda:${REGION}:${ACCOUNT}:function:${COLLECTOR}"

echo "==> 1/5 create/get HTTP API"
API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='${API_NAME}'].ApiId | [0]" --output text)
if [ "$API_ID" = "None" ] || [ -z "$API_ID" ]; then
  API_ID=$(aws apigatewayv2 create-api --name "$API_NAME" --protocol-type HTTP \
    --target "$COLLECTOR_ARN" --route-key 'POST /collect' --query ApiId --output text)
  # create-api --target auto-creates integration, route, $default stage, and lambda perm
else
  echo "   (api exists: $API_ID)"
fi
API_DOMAIN="${API_ID}.execute-api.${REGION}.amazonaws.com"
echo "   API: $API_ID  domain: $API_DOMAIN"

echo "==> 2/5 ensure Lambda allows API Gateway invoke"
aws lambda add-permission --function-name "$COLLECTOR" --statement-id apigw-invoke \
  --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT}:${API_ID}/*/*/collect" 2>/dev/null || echo "   (permission exists)"

echo "==> 3/5 smoke-test the API directly (POST with body)"
curl -s -o /dev/null -w "   API POST -> HTTP %{http_code}\n" -X POST \
  "https://${API_DOMAIN}/collect" -H 'Content-Type: application/json' \
  -d '{"type":"pageview","path":"/apigw-test"}'

echo "==> 4/5 repoint CloudFront /collect origin to the API (drop OAC)"
aws cloudfront get-distribution-config --id "$DIST" > "$WORK/dist.json"
ETAG=$(jq -r .ETag "$WORK/dist.json")
jq .DistributionConfig "$WORK/dist.json" > "$WORK/config.json"
cp "$WORK/config.json" "$(dirname "$0")/cloudfront-config.backup.json"
jq --arg dom "$API_DOMAIN" --arg id "$ORIGIN_ID" '
  .Origins.Items |= map(if .Id==$id then (.DomainName=$dom | .OriginAccessControlId="") else . end)
' "$WORK/config.json" > "$WORK/new.json"

echo "==> 5/5 update-distribution (ETag $ETAG)"
aws cloudfront update-distribution --id "$DIST" --if-match "$ETAG" \
  --distribution-config "file://$WORK/new.json" --query 'Distribution.Status' --output text
echo "   done. Wait for propagation, then POST https://www.savvytechies.com/collect"
