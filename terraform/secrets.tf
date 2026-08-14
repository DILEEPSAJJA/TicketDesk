# Generate random secure password for RDS MySQL database
resource "random_password" "db_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# AWS Secrets Manager Secret for DB Credentials (uses name_prefix to avoid name collision)
resource "aws_secretsmanager_secret" "db_credentials" {
  name_prefix             = "${var.resource_prefix}-db-secret-"
  recovery_window_in_days = 0

  tags = {
    Name = "${var.resource_prefix}-db-secret"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "ticketdesk_admin"
    password = random_password.db_password.result
    dbname   = "ticketdesk_db"
  })
}

# Systems Manager Parameter Store for JWT Secret
resource "aws_ssm_parameter" "jwt_secret" {
  name      = "/${var.resource_prefix}/JWT_SECRET"
  type      = "SecureString"
  value     = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
  overwrite = true

  tags = {
    Name = "${var.resource_prefix}-jwt-secret-param"
  }
}
