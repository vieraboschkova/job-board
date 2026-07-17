# Deployment

## Recommendation

Deploy to Render as a single Node web service.

This is the simplest deployment model for the take-home project because one process can serve both:

- API routes
- built React static files

## Local Development

Local development should run backend and frontend dev servers.

Expected root commands after scaffolding:

```bash
npm install
npm run dev
```

Expected workspace commands:

```bash
npm run dev -w server
npm run dev -w client
```

## Production Build

Expected root build command:

```bash
npm run build
```

The build should:

- compile the backend TypeScript
- build the React/Vite frontend

## Production Start

Expected start command:

```bash
npm start
```

In production, the Node server should:

- listen on `process.env.PORT`
- serve API routes from `/api/*`
- serve frontend assets from the built client directory
- return `index.html` for non-API frontend routes

## Environment Variables

Minimum expected variables:

```txt
NODE_ENV=production
PORT=<provided by platform>
CLIENT_DIST_PATH=../client/dist
```

`CLIENT_DIST_PATH` can default to the expected monorepo path and only be overridden when needed.

## Render Setup

Create a Render Web Service with:

```txt
Runtime: Node
Build command: npm install && npm run build
Start command: npm start
Environment:
  NODE_ENV=production
```

Render will provide `PORT`.

## Deployment Timing

Deploy early after the thin shell exists:

1. health endpoint
2. placeholder React/MUI page
3. production static serving
4. Render deployment

Then continue with ingestion, approval, storage, and UI features.

## Optional Fly.io Path

Use Fly.io if Docker parity becomes important.

Expected files would include:

- `Dockerfile`
- `fly.toml`

This is optional polish for the take-home project.
