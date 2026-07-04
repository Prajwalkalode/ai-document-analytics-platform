resource "aws_sns_topic" "document_events" {
  name = "${var.project}-${var.environment}-document-events"

  tags = merge(
    {
      Project     = var.project
      Environment = var.environment
    },
    var.tags,
  )
}

resource "aws_sqs_queue" "document_events_dlq" {
  name = "${var.project}-${var.environment}-document-events-dlq"

  tags = merge(
    {
      Project     = var.project
      Environment = var.environment
    },
    var.tags,
  )
}

resource "aws_sqs_queue" "document_events" {
  name = "${var.project}-${var.environment}-document-events"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.document_events_dlq.arn
    maxReceiveCount     = 3
  })

  tags = merge(
    {
      Project     = var.project
      Environment = var.environment
    },
    var.tags,
  )
}

resource "aws_sns_topic_subscription" "document_events_sqs_target" {
  topic_arn = aws_sns_topic.document_events.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.document_events.arn
}

resource "aws_lambda_event_source_mapping" "document_events_queue" {
  count            = var.lambda_function_arn != null ? 1 : 0
  event_source_arn = aws_sqs_queue.document_events.arn
  function_name    = var.lambda_function_arn
  batch_size       = 1
}
