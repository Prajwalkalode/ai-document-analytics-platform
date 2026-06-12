resource "aws_dynamodb_table" "ai_results" {
  name         = "${var.project}-${var.environment}-ai-results"
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
