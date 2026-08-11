# DB Subnet Group (Private subnets across 2 AZs)
resource "aws_db_subnet_group" "main" {
  name       = "${var.resource_prefix}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.resource_prefix}-db-subnet-group"
  }
}

# RDS Security Group (Allows MySQL 3306 ONLY from ECS Tasks SG)
resource "aws_security_group" "rds" {
  name        = "${var.resource_prefix}-rds-sg"
  description = "Allows MySQL 3306 inbound traffic ONLY from ECS tasks security group"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MySQL port strictly from ECS tasks"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    description = "Allow outbound response traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.resource_prefix}-rds-sg"
  }
}

# RDS MySQL Instance
resource "aws_db_instance" "mysql" {
  identifier             = "${var.resource_prefix}-mysql"
  allocated_storage      = 20
  max_allocated_storage  = 50
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  db_name                = "ticketdesk_db"
  username               = "ticketdesk_admin"
  password               = random_password.db_password.result
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = {
    Name = "${var.resource_prefix}-mysql-rds"
  }
}
