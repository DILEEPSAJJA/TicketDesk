output "alb_dns_name" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "Public URL of the Application Load Balancer"
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
