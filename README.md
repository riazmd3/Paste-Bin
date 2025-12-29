# Pastebin-Lite

A lightweight pastebin web application built with Next.js 14, TypeScript, and Redis persistence via Upstash. Users can create text pastes with optional expiration (TTL) and view limits, and share them via unique URLs.

## Features

- Create text pastes with optional TTL (time-to-live) and maximum view limits
- Share pastes via unique URLs
- View pastes via HTML page or JSON API
- Atomic view counting using Redis
- Deterministic time handling for automated testing
- Serverless-safe architecture for Vercel deployment

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with your Upstash Redis credentials:
   ```
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Persistence Layer

This application uses **Upstash Redis** for persistence. All paste data is stored in Redis under keys following the pattern `paste:<id>`. Each paste is stored as JSON with the following structure:

```json
{
  "content": "string",
  "created_at": number,
  "expires_at": number | null,
  "max_views": number | null,
  "views": number
}
```

## API Endpoints

### Health Check
- `GET /api/healthz` - Returns Redis connectivity status

### Create Paste
- `POST /api/pastes` - Creates a new paste
  - Body: `{ "content": string, "ttl_seconds": number?, "max_views": number? }`
  - Returns: `{ "id": string, "url": string }`

### Get Paste (API)
- `GET /api/pastes/:id` - Retrieves paste content (increments view count)
  - Returns: `{ "content": string, "remaining_views": number | null, "expires_at": string | null }`

### View Paste (HTML)
- `GET /p/:id` - Displays paste content as HTML (does not increment view count)

## Important Design Decisions

1. **Atomic View Counting**: View increments are performed atomically using Redis Lua scripts to prevent race conditions in concurrent scenarios.

2. **Deterministic Time Handling**: When `TEST_MODE=1` environment variable is set, the application reads the `x-test-now-ms` header to use deterministic timestamps for expiry logic, enabling reliable automated testing.

3. **Expiration Logic**: Pastes expire when either the TTL is reached OR the view limit is exceeded, whichever comes first. Both conditions are checked before serving a paste.

4. **Serverless Architecture**: The application is designed to be stateless and serverless-safe, with no global mutable state. All state is persisted in Redis.

5. **Safe HTML Rendering**: Paste content is escaped using HTML entity encoding to prevent XSS attacks. Content is displayed in a `<pre>` tag to preserve formatting.

6. **Error Handling**: All API endpoints return proper JSON error responses with appropriate HTTP status codes. Unavailable pastes (missing, expired, or view limit exceeded) all return 404 status.

## Deployment

This application is designed for deployment on Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add environment variables (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`)
4. Deploy

The application will automatically build and deploy using the `npm run build` command.

