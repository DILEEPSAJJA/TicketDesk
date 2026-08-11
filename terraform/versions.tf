terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # For remote backend state locking (Configured in M6/Day 7)
  # backend "s3" {
  #   bucket         = "tkt-capstone-tfstate"
  #   key            = "m2-infrastructure/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "tkt-capstone-tflocks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "TicketDesk"
      Owner       = "Capstone-Engineering"
      Environment = var.environment
      CostCenter  = "Education-Capstone"
      ManagedBy   = "Terraform"
    }
  }
}
