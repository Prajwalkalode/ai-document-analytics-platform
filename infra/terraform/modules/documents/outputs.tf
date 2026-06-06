output "documents_table_name" {
  description = "DynamoDB Documents table name."
  value       = aws_dynamodb_table.documents.name
}

output "documents_table_arn" {
  description = "ARN of the DynamoDB Documents table."
  value       = aws_dynamodb_table.documents.arn
}

output "documents_bucket_name" {
  description = "Name of the S3 bucket used for documents."
  value       = aws_s3_bucket.documents.bucket
}

output "documents_bucket_arn" {
  description = "ARN of the S3 bucket used for documents."
  value       = aws_s3_bucket.documents.arn
}
