resource "aws_dynamodb_table" "analytics" {
  name         = "${var.project}-${var.environment}-analytics"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "documentId"

  attribute {
    name = "documentId"
    type = "S"
  }

  tags = merge(
    {
      Project     = var.project
      Environment = var.environment
    },
    var.tags,
  )
}
