output "users_table_name" {
  description = "Name of the deployed Users DynamoDB table."
  value       = module.users_table.table_name
}

output "users_table_arn" {
  description = "ARN of the deployed Users DynamoDB table."
  value       = module.users_table.table_arn
}

output "users_email_index_name" {
  description = "Email GSI name for the Users table."
  value       = module.users_table.email_index_name
}
