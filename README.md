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
