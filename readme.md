# README.md

## Project Overview

Ball Up Top is a mobile pickup basketball app where players check into courts via GPS, rate opponents after sessions, and build skill profiles with EMA-weighted ratings (45-99) and 40+ archetypes. Positioned as "Yik Yak for college pickup basketball" — identity-driven.

## Commands

### Server (`/server`)
```bash
npm run dev          # Start dev server with nodemon
npm run build        # Build for production
npm start            # Run production build
npx drizzle-kit generate   # Generate migration from schema changes
npx drizzle-kit migrate    # Run migrations
npx drizzle-kit studio     # Open Drizzle Studio GUI
```

### Client (`/client`)
```bash
npm run dev          # Start Expo dev server (clears cache)
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
```

### Marketing (`/marketing`)
Next.js marketing site — standard `npm run dev` / `npm run build`.

## Architecture

### Server
- **Express + Socket.io** on single HTTP server
- **Drizzle ORM** with PostgreSQL — schema at `server/src/db/schema.ts`, relations at `relations.ts`
- **BullMQ + Redis** for background jobs — queues in `server/src/queues/`, workers in `server/src/workers/`
- **better-auth** handles authentication at `/api/auth/*`
- Routes: `courts`, `courtSessions`, `users`, `home`, `places`
- Real-time cache invalidation via Socket.io namespace `/invalidation` — client subscribes and invalidates TanStack Query cache

### Client
- **Expo Router** with file-based routing — tabs at `app/(tabs)/`
- **TanStack Query** for server state — API wrapper in `lib/endpoints.ts`
- **NativeWind** (Tailwind for React Native) — configured with `tailwind.config.js`
- **better-auth/expo** client in `lib/auth-client.ts`
- UI primitives from `@rn-primitives/*`, charts from `react-native-gifted-charts`

### Core Domain Flow
1. User checks in at court (GPS proximity validated server-side)
2. `courtSession` created, Socket.io broadcasts to invalidate court's active player list
3. On checkout, `encounteredPlayer` rows created for all overlapping players with precomputed weights
4. User rates encountered players, ratings applied with outlier detection
5. Ratee's overall/archetype updated, activity created, push notification sent via BullMQ worker

### Key Tables
- `user` — ratings stored directly (overall, shooting, defense, playmaking, finishing)
- `court` — each college can have multiple courts
- `courtSession` — check-in/out tracking, unique constraint ensures one active session per user
- `encounteredPlayer` — draft ratings and precomputed weights for the rating form
- `rating` — finalized ratings with full audit trail
- `leaderboard` — per-college rankings, updated on rating submission

## Environment Variables

Server requires: `DATABASE_URL`, `REDIS_URL`, `PORT`, `NODE_ENV`, plus auth/notification service keys.

Client requires: `EXPO_PUBLIC_SERVER_URL`.
