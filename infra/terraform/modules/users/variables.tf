variable "project" {
  description = "Project name used for resource naming and tagging."
  type        = string
}

variable "environment" {
  description = "Deployment environment name, e.g. dev, staging, prod."
  type        = string
}

variable "enable_pitr" {
  description = "Enable Point-in-Time Recovery for the table. Disable by default for cost-sensitive dev environments."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Additional tags applied to the DynamoDB table."
  type        = map(string)
  default     = {}
}
