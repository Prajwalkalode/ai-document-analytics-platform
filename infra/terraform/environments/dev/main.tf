terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0"
    }
  }
}

provider "aws" {
  region = var.region
}

locals {
  project     = "ai-document-analytics-platform"
  environment = "dev"
}

module "users_table" {
  source      = "../../modules/users"
  project     = local.project
  environment = local.environment
  tags = {
    Project     = local.project
    Environment = local.environment
  }
}

module "documents" {
  source      = "../../modules/documents"
  project     = local.project
  environment = local.environment
  tags = {
    Project     = local.project
    Environment = local.environment
  }
}

module "document_content" {
  source      = "../../modules/document_content"
  project     = local.project
  environment = local.environment
  tags = {
    Project     = local.project
    Environment = local.environment
  }
}

module "ai_results" {
  source      = "../../modules/ai_results"
  project     = local.project
  environment = local.environment
  tags = {
    Project     = local.project
    Environment = local.environment
  }
}
