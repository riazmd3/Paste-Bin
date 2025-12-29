📌 Pastebin-Lite

Pastebin-Lite is a lightweight web application that allows users to create and share text pastes via a unique URL. Each paste can optionally expire after a specified time (TTL) or after a limited number of views. Once any configured constraint is reached, the paste becomes unavailable.

The application is built using Next.js (App Router) and is designed to run in a serverless environment. It uses a persistent storage layer to ensure data survives across requests and supports deterministic time handling for reliable automated testing.

Key features include:

Create and share text pastes

Optional time-based expiration (TTL)

Optional view-count limits

Safe HTML rendering of paste content

REST APIs for creation and retrieval

Health check endpoint for service monitoring

The project is optimized for deployment on Vercel and follows best practices for reliability, security, and testability.