resource "aws_dynamodb_table" "users" {
  name         = "${var.project}-${var.environment}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name               = "EmailIndex"
    hash_key           = "email"
    projection_type    = "ALL"
  }

  point_in_time_recovery {
    enabled = var.enable_pitr
  }

  tags = merge(
    {
      Project     = var.project
      Environment = var.environment
    },
    var.tags,
  )
}
