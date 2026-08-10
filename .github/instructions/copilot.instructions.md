---
description: Root Copilot instructions for the Biddar app. Applies to all files in this repository.
applyTo: '**'
---

# Biddar — Copilot Instructions

This is a full-stack auction app with two separate runtimes:

- **`/client`** — Next.js 14 (App Router + Pages Router for API routes), React, Redux, TanStack Query, Formik, Tailwind
- **`/server`** — Express.js, Firebase (Auth + Firestore + Storage), Redis (node-redis), Ably, JWT

---

## Architecture

- The client and server are **separate apps** with separate `package.json` and `.env` files
- The server is mounted under `/api/*` (e.g. `POST /api/login`, `GET /api/products`)
- Client always prefixes server calls with `process.env.NEXT_PUBLIC_API_URL` + `/api/`
- `pages/api/` routes in the Next.js client are **Next.js server-side routes**, not Express — they run in the Next.js Node.js process, not the browser

## Environment variables

- `NEXT_PUBLIC_*` vars are bundled into browser JS — never put secrets there
- `ABLY_API_KEY` (root key) lives in both `client/.env` (for Next.js API route) and `server/.env` — never as `NEXT_PUBLIC_`
- `FIREBASE_SERVICE_ACCOUNT_JSON` can be a file path (local) or inline JSON string (Vercel)
- On Vercel, use individual `FIREBASE_SERVICE_ACCOUNT_*` env vars instead of a file path

## Firebase

- The server uses **both** the client SDK (`firebase/firestore`, `firebase/auth`) and the Admin SDK (`firebase-admin`)
- Cron jobs and server-to-server operations must use the **Admin SDK** to bypass Firestore security rules
- The client (browser) uses Firebase Storage only — auth and Firestore go through the Express API

## Redis

- Uses `node-redis` (not `ioredis`)
- Connection uses `createClient` with `username: 'default'`, `socket: { host, port }`, and explicit `connect()`
- Redis is used exclusively for **JWT token blacklisting** on logout

## Ably

- Root key is server-side only
- Browser gets short-lived tokens via `GET /api/createTokenRequest` (Next.js API route)
- `useSocket.js` uses `authUrl: '/api/createTokenRequest'` — never the root key directly

---

## Skills

Load the following skills when working on related areas:

| Area | Skill |
|---|---|
| Logging | `.github/skills/logging/SKILL.md` |
