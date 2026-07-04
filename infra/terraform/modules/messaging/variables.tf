variable "project" {
  description = "Project name used for resource naming and tagging."
  type        = string
}

variable "environment" {
  description = "Deployment environment name, e.g. dev, staging, prod."
  type        = string
}

variable "tags" {
  description = "Additional tags applied to the messaging resources."
  type        = map(string)
  default     = {}
}

variable "lambda_function_arn" {
  description = "ARN of the Lambda function that will consume from the SQS queue."
  type        = string
  default     = null
}
