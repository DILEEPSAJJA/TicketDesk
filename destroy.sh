#!/bin/bash
# ==============================================================================
# TicketDesk Automated AWS Infrastructure Destruction Script
# ==============================================================================
set -e

export AWS_REGION="${AWS_REGION:-us-east-1}"
export AWS_DEFAULT_REGION="${AWS_REGION:-us-east-1}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/terraform"

echo "======================================================================"
echo "⚡ STARTING AUTOMATED DESTRUCTION OF ALL AWS TICKETDESK RESOURCES ⚡"
echo "======================================================================"

# 1. Empty S3 Buckets before destruction
echo "1. Emptying S3 Buckets..."
cd "$TERRAFORM_DIR"
FRONTEND_BUCKET=$(./terraform output -raw s3_bucket_name 2>/dev/null || true)
ATTACHMENTS_BUCKET=$(./terraform output -raw attachments_bucket_name 2>/dev/null || true)

if [ -n "$FRONTEND_BUCKET" ]; then
  echo "  --> Emptying $FRONTEND_BUCKET..."
  aws s3 rm "s3://$FRONTEND_BUCKET" --recursive >/dev/null 2>&1 || true
fi

if [ -n "$ATTACHMENTS_BUCKET" ]; then
  echo "  --> Emptying $ATTACHMENTS_BUCKET..."
  aws s3 rm "s3://$ATTACHMENTS_BUCKET" --recursive >/dev/null 2>&1 || true
fi

# 2. Run Terraform Destroy
echo "2. Executing Terraform Destroy..."
./terraform destroy -auto-approve

echo "======================================================================"
echo "✅ ALL AWS RESOURCES & SERVICES HAVE BEEN SUCCESSFULLY DESTROYED!"
echo "======================================================================"
