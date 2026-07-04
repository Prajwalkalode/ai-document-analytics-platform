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

output "documents_table_name" {
  description = "Name of the deployed Documents DynamoDB table."
  value       = module.documents.documents_table_name
}

output "documents_bucket_name" {
  description = "Name of the deployed Documents S3 bucket."
  value       = module.documents.documents_bucket_name
}

output "document_content_table_name" {
  description = "Name of the deployed Document Content DynamoDB table."
  value       = module.document_content.document_content_table_name
}

output "document_content_table_arn" {
  description = "ARN of the deployed Document Content DynamoDB table."
  value       = module.document_content.document_content_table_arn
}

output "messaging_sns_topic_arn" {
  description = "ARN of the deployed SNS topic for document events."
  value       = module.messaging.sns_topic_arn
}

output "messaging_sqs_queue_url" {
  description = "URL of the deployed SQS queue for document events."
  value       = module.messaging.sqs_queue_url
}

output "messaging_sqs_queue_arn" {
  description = "ARN of the deployed SQS queue for document events."
  value       = module.messaging.sqs_queue_arn
}

output "messaging_sqs_dlq_arn" {
  description = "ARN of the deployed SQS dead-letter queue."
  value       = module.messaging.sqs_dlq_arn
}
