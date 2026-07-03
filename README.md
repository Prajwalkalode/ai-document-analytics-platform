# ai-document-analytics-platform
Utilizing the power of AI to analyze documents.

## Auth Service
The `auth-service` provides user registration, authentication, current user retrieval, and health monitoring for the platform.

### Environment Variables
- `PORT` - Port for the auth service (default: `3000`)
- `AWS_REGION` - AWS region for DynamoDB operations
- `AUTH_TABLE_NAME` - DynamoDB table name for user storage
- `JWT_SECRET` - Secret used to sign JWT tokens

### Local Startup
```bash
cd services/auth-service
npm install
npm run dev
```

### Swagger UI
- OpenAPI docs are available at `GET /api-docs`
- Central OpenAPI definition file: `docs/openapi.yml`

### API Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and receive a JWT
- `GET /auth/me` - Fetch the currently authenticated user
- `GET /health` - Health and dependency status for the auth service

### Example curl Requests
Register:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"Jane Doe","password":"P@ssw0rd123"}'
```

Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"P@ssw0rd123"}'
```

Get current user:
```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

Health check:
```bash
curl http://localhost:3000/health
```

## Upload Service
The `upload-service` allows authenticated users to upload documents to S3 and persist metadata in DynamoDB.

### Environment Variables
- `PORT` - Port for the upload service
- `AWS_REGION` - AWS region for S3 and DynamoDB operations
- `DOCUMENTS_TABLE_NAME` - DynamoDB table for document metadata
- `DOCUMENTS_BUCKET_NAME` - S3 bucket for uploaded documents
- `JWT_SECRET` - Secret used to validate JWT tokens

### Local Startup
```bash
cd services/upload-service
npm install
npm run dev
```

### API Endpoints
- `POST /upload` - Upload a document
- `GET /health` - Health and dependency status for the upload service

### Example curl Requests
Upload document:
```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@document.pdf"
```

Health check:
```bash
curl http://localhost:3000/health
```

## Processing Service
The `processing-service` receives a document ID, downloads the uploaded document from S3, extracts text, stores the extracted content in DynamoDB, and updates document status.

### Environment Variables
- `PORT` - Port for the processing service
- `AWS_REGION` - AWS region for S3 and DynamoDB operations
- `DOCUMENTS_TABLE_NAME` - DynamoDB table containing uploaded document metadata
- `DOCUMENT_CONTENT_TABLE_NAME` - DynamoDB table containing extracted document content
- `DOCUMENTS_BUCKET_NAME` - S3 bucket for uploaded documents
- `JWT_SECRET` - Secret used to validate JWT tokens

### Local Startup
```bash
cd services/processing-service
npm install
npm run dev
```

### API Endpoints
- `POST /process` - Process an uploaded document
- `GET /health` - Health and dependency status for the processing service

### Example curl Requests
Process document:
```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"documentId":"DOC12345678"}'
```

Health check:
```bash
curl http://localhost:3000/health
```

## Continuous Integration
This repository includes a GitHub Actions pipeline defined in `.github/workflows/ci.yml`.

The CI workflow:
- runs on `push` and `pull_request` events
- installs Node.js using the LTS version
- caches npm dependencies per service using each service `package-lock.json`
- validates Lambda package installations by running `npm ci` and `npm ls --depth=0` in every service folder
- runs `npm test` and `npm run coverage` for each microservice
- checks Terraform formatting with `terraform fmt -check`
- initializes and validates Terraform under `infra/terraform`

The workflow fails when:
- any service tests fail
- any service coverage command fails
- Terraform formatting or validation fails

### Local Startup
```bash
cd upload-service
npm install
npm run dev
```

### API Endpoints
- `POST /upload` - Upload a document
- `GET /health` - Health and dependency status for the upload service

### Example curl Requests
Upload document:
```bash
curl -X POST http://localhost:3000/upload \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@document.pdf"
```

Health check:
```bash
curl http://localhost:3000/health
```
