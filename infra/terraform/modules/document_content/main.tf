resource "aws_dynamodb_table" "document_content" {
  name         = "${var.project}-${var.environment}-document-content"
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
