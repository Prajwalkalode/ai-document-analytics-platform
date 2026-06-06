data "aws_caller_identity" "current" {}

resource "aws_dynamodb_table" "documents" {
  name         = "${var.project}-${var.environment}-documents"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "documentId"

  attribute {
    name = "documentId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "UserIndex"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = merge(
    {
      Project     = var.project
      Environment = var.environment
    },
    var.tags,
  )
}

resource "aws_s3_bucket" "documents" {
  bucket = "${var.project}-${var.environment}-documents-${data.aws_caller_identity.current.account_id}"

  tags = merge(
    {
      Project     = var.project
      Environment = var.environment
    },
    var.tags,
  )
}
