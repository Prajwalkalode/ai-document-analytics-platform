output "sns_topic_arn" {
  description = "ARN of the SNS topic for document events."
  value       = aws_sns_topic.document_events.arn
}

output "sns_topic_name" {
  description = "Name of the SNS topic for document events."
  value       = aws_sns_topic.document_events.name
}

output "sqs_queue_url" {
  description = "URL of the SQS queue for document events."
  value       = aws_sqs_queue.document_events.id
}

output "sqs_queue_arn" {
  description = "ARN of the SQS queue for document events."
  value       = aws_sqs_queue.document_events.arn
}

output "sqs_dlq_arn" {
  description = "ARN of the SQS dead-letter queue."
  value       = aws_sqs_queue.document_events_dlq.arn
}

output "event_source_mapping_id" {
  description = "ID of the Lambda event source mapping, if configured."
  value       = try(aws_lambda_event_source_mapping.document_events_queue[0].id, null)
}
