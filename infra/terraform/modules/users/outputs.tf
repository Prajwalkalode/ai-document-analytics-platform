output "table_name" {
  description = "DynamoDB Users table name."
  value       = aws_dynamodb_table.users.name
}

output "table_arn" {
  description = "ARN of the DynamoDB Users table."
  value       = aws_dynamodb_table.users.arn
}

output "email_index_name" {
  description = "Global secondary index name for user email lookup."
  value       = "EmailIndex"
}
