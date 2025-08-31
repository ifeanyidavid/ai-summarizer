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

## Building for Production

1. Build the client:

```bash
npm run build
```

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
