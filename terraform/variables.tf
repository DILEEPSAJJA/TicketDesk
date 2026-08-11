variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS Region for deployment"
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Deployment environment (dev, staging, prod)"
}

variable "resource_prefix" {
  type        = string
  default     = "tkt-capstone"
  description = "Prefix applied to all AWS resources"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "CIDR block for main VPC"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
  description = "CIDR blocks for 2 Public Subnets"
}

variable "private_subnet_cidrs" {
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
  description = "CIDR blocks for 2 Private Subnets"
}

variable "availability_zones" {
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
  description = "Availability Zones for multi-AZ resiliency"
}

variable "container_image" {
  type        = string
  default     = "public.ecr.aws/docker/library/alpine:latest"
  description = "ECR Image URI with commit SHA tag"
}

variable "container_port" {
  type        = number
  default     = 8080
  description = "Port exposed by the application container"
}

variable "app_count" {
  type        = number
  default     = 2
  description = "Number of ECS Fargate tasks to run"
}

variable "fargate_cpu" {
  type        = string
  default     = "256"
  description = "Fargate CPU units (256 = 0.25 vCPU)"
}

variable "fargate_memory" {
  type        = string
  default     = "512"
  description = "Fargate Memory in MB (512 = 0.5 GB)"
}
