output "alb_dns_name" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "Public URL of the Application Load Balancer"
}

output "alb_hostname" {
  value       = aws_lb.main.dns_name
  description = "Hostname of Application Load Balancer"
}

output "vpc_id" {
  value       = aws_vpc.main.id
  description = "VPC Identifier"
}

output "public_subnet_ids" {
  value       = aws_subnet.public[*].id
  description = "Public Subnet Identifiers"
}

output "private_subnet_ids" {
  value       = aws_subnet.private[*].id
  description = "Private Subnet Identifiers"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "ECS Cluster Name"
}

output "ecs_service_name" {
  value       = aws_ecs_service.main.name
  description = "ECS Service Name"
}

output "cloudwatch_log_group" {
  value       = aws_cloudwatch_log_group.ecs.name
  description = "CloudWatch Log Group Name"
}

output "rds_endpoint" {
  value       = aws_db_instance.mysql.endpoint
  description = "Private RDS MySQL Endpoint"
}

output "secretsmanager_db_credentials_arn" {
  value       = aws_secretsmanager_secret.db_credentials.arn
  description = "AWS Secrets Manager Secret ARN for DB Credentials"
}

output "ssm_jwt_secret_arn" {
  value       = aws_ssm_parameter.jwt_secret.arn
  description = "AWS SSM Parameter Store ARN for JWT Secret"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.frontend_bucket.bucket
  description = "Frontend Static Website Hosting S3 Bucket Name"
}

output "s3_website_endpoint" {
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
  description = "Frontend S3 Website Endpoint URL"
}

output "attachments_bucket_name" {
  value       = aws_s3_bucket.attachments_bucket.bucket
  description = "Attachments S3 Bucket Name"
}

output "lambda_function_name" {
  value       = aws_lambda_function.thumbnail.function_name
  description = "Thumbnail Generator Lambda Function Name"
}

output "cloudwatch_dashboard_name" {
  value       = aws_cloudwatch_dashboard.main.dashboard_name
  description = "Observability CloudWatch Dashboard Name"
}

output "sns_alerts_topic_arn" {
  value       = aws_sns_topic.alerts.arn
  description = "SNS Alert Notification Topic ARN"
}
