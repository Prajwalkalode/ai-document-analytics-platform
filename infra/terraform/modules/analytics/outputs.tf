output "analytics_table_name" {
  description = "Name of the deployed Analytics DynamoDB table."
  value       = aws_dynamodb_table.analytics.name
}

output "analytics_table_arn" {
  description = "ARN of the deployed Analytics DynamoDB table."
  value       = aws_dynamodb_table.analytics.arn
}
