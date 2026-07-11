# Deployment (GitHub Actions → S3 + CloudFront)

`.github/workflows/deploy.yml` builds the Astro site and deploys on every push to
`main` (or via manual "Run workflow"):
- `npm ci && npm run build` → `dist/`
- `aws s3 sync dist/ s3://www.savvytechies.com` (immutable cache for `_astro/*`)
- CloudFront invalidation of `/*` on distribution `E3OEC4DI1YRJ40`

Auth is **GitHub OIDC → assume an IAM role** — no long-lived AWS keys in the repo.

## One-time AWS setup

Replace `<ACCOUNT_ID>` with your AWS account id. Region defaults to `us-east-1`.

### 1. GitHub OIDC provider (skip if it already exists)
```sh
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com
```

### 2. IAM role with a trust policy scoped to this repo
`trust.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike":   { "token.actions.githubusercontent.com:sub": "repo:savvytechies/website:*" }
    }
  }]
}
```
```sh
aws iam create-role --role-name savvytechies-website-deploy \
  --assume-role-policy-document file://trust.json
```

### 3. Least-privilege permissions
`perms.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Sid": "S3List",    "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::www.savvytechies.com" },
    { "Sid": "S3Objects", "Effect": "Allow", "Action": ["s3:PutObject","s3:DeleteObject","s3:GetObject"], "Resource": "arn:aws:s3:::www.savvytechies.com/*" },
    { "Sid": "CF",        "Effect": "Allow", "Action": ["cloudfront:CreateInvalidation","cloudfront:GetInvalidation"], "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/E3OEC4DI1YRJ40" }
  ]
}
```
```sh
aws iam put-role-policy --role-name savvytechies-website-deploy \
  --policy-name deploy --policy-document file://perms.json
```

### 4. Tell GitHub the role ARN
```sh
gh secret set AWS_ROLE_ARN --repo savvytechies/website \
  --body "arn:aws:iam::<ACCOUNT_ID>:role/savvytechies-website-deploy"
```
(or Settings → Secrets and variables → Actions → New repository secret)

Optional variables (defaults shown, override only if different):
`AWS_REGION=us-east-1`, `S3_BUCKET=www.savvytechies.com`, `CLOUDFRONT_DISTRIBUTION_ID=E3OEC4DI1YRJ40`.

## First run
Until `AWS_ROLE_ARN` is set, the workflow will fail at the "Configure AWS
credentials" step — that's expected. Set the secret, then re-run.

## Fallback: static access keys (not recommended)
If you can't use OIDC, replace the credentials step's `role-to-assume` with
`aws-access-key-id`/`aws-secret-access-key` from secrets — but OIDC avoids storing
long-lived keys and is preferred.
