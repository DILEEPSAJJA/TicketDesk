# ECR Repository for TicketDesk Backend Monolith Image
resource "aws_ecr_repository" "backend" {
  name                 = "ticketdesk-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.resource_prefix}-ecr-backend"
    Environment = var.environment
  }
}
