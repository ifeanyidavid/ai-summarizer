### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

The application can be run using Docker Compose, which will start both the frontend and API services.

1. First, create a `.env` file with your environment variables:

```bash
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_api_key
```

2. Build and start the services:

```bash
docker compose up --build
```

This will:

- Build the application
- Start the API server on port 3000
- Start the frontend server on port 3030
- Set up all necessary environment variables

To stop the services:

```bash
docker compose down
```

For development, you can still run the services individually:

```bash
npm run dev:frontend  # Runs frontend on port 3030
npm run dev:api      # Runs API on port 3000
```
