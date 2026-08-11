# Security Group for Application Load Balancer (Public facing)
resource "aws_security_group" "alb" {
  name        = "${var.resource_prefix}-alb-sg"
  description = "Allows HTTP inbound web traffic to Load Balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.resource_prefix}-alb-sg"
  }
}

# Security Group for ECS Fargate Tasks (Private subnet compute)
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.resource_prefix}-ecs-tasks-sg"
  description = "Allows inbound traffic to application container ONLY from ALB Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow container port traffic strictly from ALB"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Allow outbound internet access for image pulls & AWS service calls"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.resource_prefix}-ecs-tasks-sg"
  }
}
