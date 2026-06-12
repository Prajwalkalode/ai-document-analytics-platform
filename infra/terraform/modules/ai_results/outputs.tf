output "ai_results_table_name" {
  description = "DynamoDB AI Results table name."
  value       = aws_dynamodb_table.ai_results.name
}

output "ai_results_table_arn" {
  description = "ARN of the DynamoDB AI Results table."
  value       = aws_dynamodb_table.ai_results.arn
}
