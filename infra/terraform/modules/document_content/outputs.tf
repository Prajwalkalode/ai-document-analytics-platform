output "document_content_table_name" {
  description = "DynamoDB Document Content table name."
  value       = aws_dynamodb_table.document_content.name
}

output "document_content_table_arn" {
  description = "ARN of the DynamoDB Document Content table."
  value       = aws_dynamodb_table.document_content.arn
}
