# Real-time Chat App

A fullstack real-time chat application built with React, Node.js, Socket.IO, and PostgreSQL.

The project was created as a pet project to practice:

- WebSocket architecture
- realtime communication
- authentication/authorization
- frontend state management
- admin moderation systems
- responsive SPA UI/UX

---

## Tech Stack

# Frontend

- React
- TypeScript
- Zustand
- Material UI

# Backend

- Node.js
- Express
- TypeScript
- Socket.IO (WebSocket)

# Database

- PostgreSQL
- Prisma

# Authentication & Security

- JWT Authentication
- bcrypt password hashing

---

## Features

# Authentication

- User registration
- User login
- JWT-based authentication
- Authentication via HTTP
- All realtime functionality works via WebSocket

# Realtime Chat

Global Chat:

- Realtime message sending/receiving
- Message history loading
- Automatic synchronization between users

AI Assistant Chat:

- Built-in AI assistant chat
- Yandex AI integration
- Realtime assistant responses

# User System

- Online/offline user tracking
- Responsive online users list
- Online users automatically move to the top
- Offline users move to the bottom
- Random nickname color generation for each user

# Session Protection

If the same account logs in from another device/browser:

- the newest session stays active
- previous session gets disconnected automatically

# Message Restrictions

- Maximum 150 characters per message
- 8-second cooldown between messages
- Muted users cannot send messages

# Admin Features

- Kick/unkick users
- Mute/Unmute users

---

## Requirements

Before starting the project, make sure you have installed:

- Node.js >= 18
- npm >= 9
- PostgreSQL

---

## Installation & Start

## 1. Clone the repository

```bash
git clone https://github.com/Makflay/chat-app.git
cd chat-app
```

---

## 2. Install dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 3. Configure environment variables

Create a `.env` file inside the **chat-app** folder based on `.env.example`:

Example backend variables:

DATABASE_URL=
JWT_SECRET=
PORT=

---

## 4. Database setup

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

---

## Run the application

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

---

## Available Scripts

### Backend

Start backend in development mode:

```bash
npm run dev
```

Build backend:

```bash
npm run build
```

Run production build:

```bash
npm run start
```

### Frontend

Start Vite development server:

```bash
npm run dev
```

Build frontend:

```bash
npm run build
```

---

## Architecture Notes

- HTTP is used only for authentication and initial requests
- Realtime communication works through WebSocket (Socket.IO)
- Zustand manages frontend global state
- Prisma is used as ORM for PostgreSQL
- The application follows SPA architecture

---

## Future Improvements

- OAuth authentication (Google / Yandex)
- Registration and verification via external providers
- Private chats
- Docker support
- Message editing/deleting
- E2E tests
- Better mobile UX
- Deployment configuration
