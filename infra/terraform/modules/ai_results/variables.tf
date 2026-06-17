variable "project" {
  description = "Project name used for resource naming and tagging."
  type        = string
}

variable "environment" {
  description = "Deployment environment name, e.g. dev, staging, prod."
  type        = string
}

variable "tags" {
  description = "Additional tags applied to the resources."
  type        = map(string)
  default     = {}
}
