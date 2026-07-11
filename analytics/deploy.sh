#!/usr/bin/env bash
# Provision the SavvyTechies first-party analytics pipeline.
# Idempotent-ish: safe to re-run; updates Lambda code if roles/resources exist.
#
# Creates: S3 events bucket, 2 IAM roles, collector Lambda (+ Function URL),
# reporter Lambda, daily EventBridge schedule. CloudFront wiring is a separate,
# clearly-marked step at the end (touches the PROD distribution).
#
# Review the CONFIG block, then: bash deploy.sh
set -euo pipefail

# ---------- CONFIG (edit these) ----------
REGION="us-east-1"
ACCOUNT_ID="145554831595"
BUCKET="savvytechies-analytics-events"
DISTRIBUTION_ID="E3OEC4DI1YRJ40"          # prod CloudFront (for the /collect behavior)
REPORT_SENDER="reports@savvytechies.com"  # must be under the verified savvytechies.com domain
REPORT_RECIPIENT="govind.prathi@savvytechies.com"   # <-- change to topgolf.com / add more (comma-sep)
ANONYMIZE_IP="true"                        # "false" = store full IPs (PII; needs consent/policy)
EVENT_RETENTION_DAYS="90"
DAILY_SCHEDULE="cron(0 13 * * ? *)"        # 13:00 UTC ≈ 8am ET
# -----------------------------------------

COLLECTOR="st-analytics-collector"
REPORTER="st-analytics-reporter"
COLLECTOR_ROLE="st-analytics-collector-role"
REPORTER_ROLE="st-analytics-reporter-role"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

echo "==> 1/7 S3 bucket"
aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" 2>/dev/null || echo "   (exists)"
aws s3api put-public-access-block --bucket "$BUCKET" --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
aws s3api put-bucket-lifecycle-configuration --bucket "$BUCKET" --lifecycle-configuration \
  "{\"Rules\":[{\"ID\":\"expire-raw\",\"Status\":\"Enabled\",\"Filter\":{\"Prefix\":\"events/\"},\"Expiration\":{\"Days\":${EVENT_RETENTION_DAYS}}}]}"

echo "==> 2/7 IAM roles"
TRUST='{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
for R in "$COLLECTOR_ROLE" "$REPORTER_ROLE"; do
  aws iam create-role --role-name "$R" --assume-role-policy-document "$TRUST" 2>/dev/null || echo "   ($R exists)"
  aws iam attach-role-policy --role-name "$R" \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
done
aws iam put-role-policy --role-name "$COLLECTOR_ROLE" --policy-name s3-put --policy-document \
  "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"s3:PutObject\",\"Resource\":\"arn:aws:s3:::${BUCKET}/*\"}]}"
aws iam put-role-policy --role-name "$REPORTER_ROLE" --policy-name s3-read-ses --policy-document \
  "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:ListBucket\"],\"Resource\":\"arn:aws:s3:::${BUCKET}\"},{\"Effect\":\"Allow\",\"Action\":[\"s3:GetObject\"],\"Resource\":\"arn:aws:s3:::${BUCKET}/*\"},{\"Effect\":\"Allow\",\"Action\":[\"ses:SendEmail\"],\"Resource\":\"*\"}]}"
sleep 8  # let IAM propagate

pkg() { ( cd "$(dirname "$1")" && zip -qj "$TMP/$2.zip" "$(basename "$1")" ); }

echo "==> 3/7 collector Lambda"
pkg "$(dirname "$0")/collector.mjs" "$COLLECTOR"
if aws lambda get-function --function-name "$COLLECTOR" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$COLLECTOR" --zip-file "fileb://$TMP/$COLLECTOR.zip" >/dev/null
else
  aws lambda create-function --function-name "$COLLECTOR" --runtime nodejs20.x --handler collector.handler \
    --role "arn:aws:iam::${ACCOUNT_ID}:role/${COLLECTOR_ROLE}" --zip-file "fileb://$TMP/$COLLECTOR.zip" \
    --timeout 10 --memory-size 128 >/dev/null
fi
aws lambda update-function-configuration --function-name "$COLLECTOR" \
  --environment "Variables={EVENTS_BUCKET=$BUCKET,ANONYMIZE_IP=$ANONYMIZE_IP}" >/dev/null

echo "==> 4/7 collector Function URL"
aws lambda create-function-url-config --function-name "$COLLECTOR" --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowMethods":["POST"],"AllowHeaders":["content-type"]}' 2>/dev/null || \
  aws lambda update-function-url-config --function-name "$COLLECTOR" --auth-type NONE >/dev/null
aws lambda add-permission --function-name "$COLLECTOR" --statement-id fnurl-public \
  --action lambda:InvokeFunctionUrl --principal "*" --function-url-auth-type NONE 2>/dev/null || true
FN_URL="$(aws lambda get-function-url-config --function-name "$COLLECTOR" --query FunctionUrl --output text)"
echo "   Function URL: $FN_URL"

echo "==> 5/7 reporter Lambda"
pkg "$(dirname "$0")/reporter.mjs" "$REPORTER"
if aws lambda get-function --function-name "$REPORTER" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$REPORTER" --zip-file "fileb://$TMP/$REPORTER.zip" >/dev/null
else
  aws lambda create-function --function-name "$REPORTER" --runtime nodejs20.x --handler reporter.handler \
    --role "arn:aws:iam::${ACCOUNT_ID}:role/${REPORTER_ROLE}" --zip-file "fileb://$TMP/$REPORTER.zip" \
    --timeout 120 --memory-size 256 >/dev/null
fi
aws lambda update-function-configuration --function-name "$REPORTER" \
  --environment "Variables={EVENTS_BUCKET=$BUCKET,REPORT_SENDER=$REPORT_SENDER,REPORT_RECIPIENT=$REPORT_RECIPIENT,REPORT_TZ_OFFSET=-5}" >/dev/null

echo "==> 6/7 daily schedule"
aws scheduler create-schedule --name st-analytics-daily \
  --schedule-expression "$DAILY_SCHEDULE" --flexible-time-window '{"Mode":"OFF"}' \
  --target "{\"Arn\":\"arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${REPORTER}\",\"RoleArn\":\"arn:aws:iam::${ACCOUNT_ID}:role/${REPORTER_ROLE}\"}" 2>/dev/null \
  || echo "   (schedule exists — update via update-schedule)"
aws lambda add-permission --function-name "$REPORTER" --statement-id sched-invoke \
  --action lambda:InvokeFunction --principal scheduler.amazonaws.com 2>/dev/null || true

echo "==> 7/7 DONE (backend). Function URL = $FN_URL"
cat <<EOF

NEXT — wire /collect through CloudFront (touches PROD distribution $DISTRIBUTION_ID):
  This adds a cache behavior for path '/collect' with the Function URL as origin, and an
  origin-request policy that forwards CloudFront-Viewer-Country/City headers (for geo).
  Run analytics/configure-cloudfront.sh (separate, reviewable) OR do it in the console.
  Until then the site's /collect calls won't reach the collector.
EOF
