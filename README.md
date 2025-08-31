# AI Text Summarizer

A modern web application that uses Google's Gemini AI to generate summaries of text snippets. Built with React Router, Express, and Prisma.

## Features

- Text summarization using Google's Gemini AI
- MongoDB database integration
- REST API
- Server-side rendering with React Router
- Docker support
- TypeScript throughout
- Comprehensive test coverage

## Prerequisites

- Node.js 20 or later
- MongoDB database
- Google Cloud Gemini API key
- Docker (optional)

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/ifeanyidavid/ai-summarizer.git
cd ai-summarizer
```

2. Install dependencies:

```bash
npm install
```

3. Rename the `.env.example` file to `.env` in the root directory:

```bash
NODE_ENV=development
DATABASE_URL="your_mongodb_url_here"
GEMINI_API_KEY=your_gemini_api_key
```

4. Generate Prisma schema

```
npx prisma generate
npx prisma db push
```

6. Start the development servers:

```bash
# Start both frontend and API servers
npm run dev

# Or start them separately
npm run dev:frontend  # Runs frontend on port 3030
npm run dev:api      # Runs API on port 3000
```

The application will be available at:

- Frontend: http://localhost:3030
- API: http://localhost:3000

## Docker Setup

1. Create a `.env` file as described above

2. Build and start the services:

```bash
docker compose up --build
```

3. To stop the services:

```bash
docker compose down
```

## Running Tests

The project uses Vitest for testing. You can run tests using these commands:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Documentation

### Health Check

```bash
GET /api/health
```

### Create a Text Snippet

```bash
POST /api/snippets

# Request body
{
  "text": "Your text to summarize here"
}

# cURL example
curl -X POST http://localhost:3000/api/snippets \
  -H "Content-Type: application/json" \
  -d '{"text": "Your text to summarize here"}'
```

### Get a Specific Snippet

```bash
GET /api/snippets/:id

# cURL example
curl http://localhost:3000/api/snippets/your-snippet-id
```

### Get All Snippets

```bash
GET /api/snippets

# cURL example
curl http://localhost:3000/api/snippets
```

### Postman Collection

You can import this cURL command into Postman:

```bash
curl --location 'http://localhost:3000/api/snippets' \
--header 'Content-Type: application/json' \
--data '{
    "text": "Your text to summarize here"
}'
```

## API Documentation

### Health Check

````bash
GET /api/health

# Response 200 OK
{
    "status": "ok"
}

POST /api/snippets

# Request Headers
Content-Type: application/json

# Request Body
{
    "text": "Your text to summarize here"
}

# Response 201 Created
{
    "id": "65a4f3c2b832a8d4e9b7c123",
    "text": "Your text to summarize here",
    "summary": "AI-generated summary of your text",
    "published": false,
    "createdAt": "2025-09-01T10:30:00.000Z",
    "updatedAt": "2025-09-01T10:30:00.000Z"
}

# Response 400 Bad Request (when text is missing)
{
    "status": "error",
    "message": "Text is required"
}

# Response 500 Internal Server Error (when AI service fails)
{
    "status": "error",
    "message": "Failed to generate summary: Error details here"
}

# 400 Bad Request (Invalid input)
{
    "status": "error",
    "message": "Validation error details"
}

### Common Error Response
# 404 Not Found
{
    "status": "error",
    "message": "Resource not found"
}

# 500 Internal Server Error
{
    "status": "error",
    "message": "Internal server error"
}

## Building for Production

1. Build the client:

```bash
npm run build
````

2. Build the server:

```bash
npm run build:server
```

3. Start the production server:

```bash
npm start
```

## Project Structure

```
├── api/                 # Backend API code
├── app/                 # Frontend React Router app
├── components/          # React components
├── lib/                # Shared utilities
├── prisma/             # Database schema and configuration
├── server/             # Server-side rendering setup
└── types/              # TypeScript type definitions
```

## Environment Variables

- `NODE_ENV`: Application environment (development/production)
- `DATABASE_URL`: MongoDB connection string
- `GEMINI_API_KEY`: Google Cloud Gemini API key
- `API_PORT`: API server port (default: 3000)
- `UI_PORT`: Frontend server port (default: 3030)

## Post-Implementation Reflection

### Trade-offs and Design Decisions

1. **Monolithic Architecture**
   - Chose a monolithic approach for simplicity and rapid development
   - Trade-off: Less scalable but faster to build and easier to maintain for this scope
   - Future: Could split into microservices as complexity grows

2. **API Design**
   - RESTful API for familiarity and broad client support
   - Trade-off: Doesn't support real-time updates
   - Future: Consider GraphQL for more flexible data fetching

### Future Improvements

1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Role-based access control for snippets
   - Public/private snippet visibility
   - User profiles and snippet ownership

2. **Real-time Features**
   - Server-Sent Events for streaming AI summaries

3. **DevOps & Deployment**
   - GitHub Actions CI pipeline for:
     - Linting and type checking
     - Running tests with coverage thresholds
     - Building and testing Docker images
     - Automated deployments

4. **Performance & Monitoring**
   - APM integration for performance monitoring
   - Error tracking (e.g., Sentry)
   - Request tracing for debugging

5. **UI/UX Enhancements**
   - Rich text editor for snippet input

### Known Limitations

1. **Scalability**
   - No rate limiting on API endpoints
   - Single instance deployment model
   - Limited error recovery strategies

2. **AI Integration**
   - No fallback AI service provider
   - Limited retry strategies for AI service failures
   - No caching of AI responses

The project prioritized getting a working product with core features while maintaining code quality. Future iterations would focus on scalability, reliability, and user experience enhancements.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
