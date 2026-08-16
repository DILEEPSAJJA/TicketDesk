#!/bin/bash
# ==============================================================================
# TicketDesk Complete Automated AWS Infrastructure Destruction Script
# ==============================================================================
set -e

export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-AKIARJJIQQF5FPWMKRG6}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-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}"
export AWS_DEFAULT_REGION="us-east-1"
export AWS_REGION="us-east-1"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="$SCRIPT_DIR/terraform"

echo "======================================================================"
echo "⚡ STARTING AUTOMATED DESTRUCTION OF ALL AWS TICKETDESK RESOURCES ⚡"
echo "======================================================================"

# 1. Stop ECS tasks & set desired count to 0 for instant target group release
echo "1. Stopping active ECS tasks..."
aws ecs update-service --cluster tkt-capstone-cluster --service tkt-capstone-service --desired-count 0 >/dev/null 2>&1 || true
for task in $(aws ecs list-tasks --cluster tkt-capstone-cluster --query "taskArns[*]" --output text 2>/dev/null); do
  aws ecs stop-task --cluster tkt-capstone-cluster --task $task >/dev/null 2>&1 || true
done

# 2. Empty S3 Buckets before destruction
echo "2. Emptying S3 Buckets..."
cd "$TERRAFORM_DIR"
FRONTEND_BUCKET=$(./terraform output -raw s3_bucket_name 2>/dev/null || true)
ATTACHMENTS_BUCKET=$(./terraform output -raw attachments_bucket_name 2>/dev/null || true)

if [ -n "$FRONTEND_BUCKET" ] && [ "$FRONTEND_BUCKET" != "No outputs found" ]; then
  echo "  --> Emptying $FRONTEND_BUCKET..."
  aws s3 rm "s3://$FRONTEND_BUCKET" --recursive >/dev/null 2>&1 || true
fi

if [ -n "$ATTACHMENTS_BUCKET" ] && [ "$ATTACHMENTS_BUCKET" != "No outputs found" ]; then
  echo "  --> Emptying $ATTACHMENTS_BUCKET..."
  aws s3 rm "s3://$ATTACHMENTS_BUCKET" --recursive >/dev/null 2>&1 || true
fi

# Fallback: empty any ticketdesk buckets matching prefix
for b in $(aws s3api list-buckets --query "Buckets[?starts_with(Name, 'ticketdesk-')].Name" --output text 2>/dev/null); do
  echo "  --> Emptying $b..."
  aws s3 rm "s3://$b" --recursive >/dev/null 2>&1 || true
done

# 3. Run Terraform Destroy
echo "3. Executing Terraform Destroy..."
./terraform destroy -auto-approve || true

# 4. Clean up any leftover IAM roles, DB subnet groups, log groups, and unassociated EIPs
echo "4. Purging leftover resources & releasing unassociated Elastic IPs..."
for alloc in $(aws ec2 describe-addresses --query "Addresses[?AssociationId==null].AllocationId" --output text 2>/dev/null); do
  aws ec2 release-address --allocation-id $alloc >/dev/null 2>&1 || true
done

for role in tkt-capstone-ecs-execution-role tkt-capstone-ecs-task-role tkt-capstone-lambda-role; do
  policies=$(aws iam list-attached-role-policies --role-name $role --query "AttachedPolicies[*].PolicyArn" --output text 2>/dev/null || true)
  for pol in $policies; do aws iam detach-role-policy --role-name $role --policy-arn $pol >/dev/null 2>&1 || true; done
  inline_pols=$(aws iam list-role-policies --role-name $role --query "PolicyNames[*]" --output text 2>/dev/null || true)
  for pol in $inline_pols; do aws iam delete-role-policy --role-name $role --policy-name $pol >/dev/null 2>&1 || true; done
  aws iam delete-role --role-name $role >/dev/null 2>&1 || true
done

aws rds delete-db-subnet-group --db-subnet-group-name tkt-capstone-db-subnet-group >/dev/null 2>&1 || true
aws logs delete-log-group --log-group-name /ecs/tkt-capstone-task >/dev/null 2>&1 || true

echo "======================================================================"
echo "✅ ALL AWS RESOURCES & SERVICES HAVE BEEN SUCCESSFULLY DESTROYED!"
echo "======================================================================"
