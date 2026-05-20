# Bidder

Real-time Bidding Platform

![Bidder Logo](assets/images/Logo.png)

Bidder is a modern, full-stack bidding application designed for real-time auctions. It leverages a powerful combination of Next.js for a smooth user experience and Express.js for a robust backend, with Ably ensuring that every bid is synchronized instantly across all clients.

## Project Structure


The project is organized into two main micro-services:

### Frontend (Client)
- **Framework**: [Next.js 14](https://nextjs.org/)
- **State Management**: Redux Toolkit & Redux Persist
- **Styling**: Tailwind CSS & NextUI
- **Data Fetching**: TanStack Query (React Query) & Axios
- **Real-time**: Ably
- **Forms**: Formik & Yup
## Core Features

- **Real-time Synchronization**: Instant bid updates and auction countdowns powered by Ably.
- **Auction Lifecycle**: Automated opening and closing of auctions using scheduled cron jobs.
- **Secure Payments & KYC**: Integration-ready for identity verification via ComplyCube.
- **User Dashboard**: Comprehensive tracking of active bids, won items, and account history.

## Technical Stack

### Frontend (Client)
- **Framework**: Next.js 14 (App Router)
- **State**: Redux Toolkit & TanStack Query
- **UI**: Tailwind CSS & NextUI
- **Auth**: Firebase Authentication

### Backend (Server)
- **Runtime**: Node.js & Express
- **Database**: Firebase Admin SDK
- **Caching**: Redis (ioredis)
- **Real-time**: Ably Pub/Sub

## Prerequisites

- Node.js (Latest LTS)
- npm or yarn
- Firebase Project (Firestore & Auth)
- Ably API Key
- Redis Server (for caching)

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn
- Firebase Project
- Ably Account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bidder
   ```

2. **Setup the Server**
   ```bash
   cd server
   npm install
   # Create a .env file based on .env.example and add your Firebase/Ably credentials
   npm run dev
   ```

3. **Setup the Client**
   ```bash
   cd ../client
   npm install
   # Copy client/.env.example to .env.local and fill in values
   npm run dev
   ```

## 📜 Available Scripts

### Client
- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production build.
- `npm run lint`: Lints the project files.

### Server
- `npm run dev`: Starts the server with `nodemon` for automatic restarts.
- `npm run start`: Starts the server using `node`.

## Firebase rules

Deploy Firestore and Storage rules from the repo root (requires [Firebase CLI](https://firebase.google.com/docs/cli)):

```bash
firebase deploy --only firestore:rules,storage --project bidding-app-f0697
```

- **Firestore**: all client access denied; the API uses the Admin SDK.
- **Storage**: public read on `images/`; writes limited to images under 10MB (migrate to authenticated uploads when ready).

## Security Considerations

The platform implements industry-standard security practices:
- **Rate Limiting**: Protection against brute-force attacks on API endpoints.
- **Input Validation**: Strict schema validation via `express-validator`.
- **Security Headers**: `helmet` integration for HTTP header security.
- **Authorized Access**: JWT and Firebase-based token verification for all sensitive actions.

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Ably Real-time Hub](https://ably.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

### Tools
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

This project is licensed under the ISC License.
