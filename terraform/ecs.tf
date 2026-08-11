# CloudWatch Log Group for ECS Application Logs
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.resource_prefix}-task"
  retention_in_days = 14

  tags = {
    Name = "${var.resource_prefix}-log-group"
  }
}

# IAM Task Execution Role (Allows ECS agent to pull ECR images & write CloudWatch logs)
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.resource_prefix}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Task Role (Application container runtime permissions)
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.resource_prefix}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.resource_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Fargate Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.resource_prefix}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "ticketdesk-app"
      image     = var.container_image
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ticketdesk"
        }
      }
    }
  ])
}

# ECS Fargate Service (Deploys tasks to Private Subnets behind Load Balancer)
resource "aws_ecs_service" "main" {
  name            = "${var.resource_prefix}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private[*].id
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "ticketdesk-app"
    container_port   = var.container_port
  }

  depends_on = [
    aws_lb_listener.front_end,
    aws_iam_role_policy_attachment.ecs_execution_policy
  ]
}
