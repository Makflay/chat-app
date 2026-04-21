# Real-time Chat App

A simple real-time chat application with authentication and basic admin features.  
This project was built as a pet project to practice fullstack development, WebSockets, and authentication.

---

## Tech Stack

**Frontend:**

- React
- TypeScript
- Zustand
- Material UI

**Backend:**

- Node.js
- Express
- TypeScript
- Socket.IO (WebSocket)

**Database:**

- MySQL
- Prisma

**Authentication:**

- JWT
- bcrypt

---

## Features

- User registration and login
- Global real-time chat (via WebSocket)
- Admin features:
  - Mute users (cannot send messages but can still read)
- Delete own messages

---

## Work in Progress

- Docker setup (planned)
- Additional admin features
- Project structure improvements

---

## Installation & Setup (npm)

### 1. Clone the repository

```bash
git clone https://github.com/Makflay/chat-app.git
cd chat-app
```

---

### 2. Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 3. Environment variables

Create a `.env` file inside the **chat-app** folder based on `.env.example`:

---

### 4. Database setup

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

---

### 5. Run the application

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

---

## Architecture Overview

- The client communicates with the server using Socket.IO
- JWT is used for authentication
- Prisma is used as an ORM for MySQL
- Zustand manages frontend state

---

## Notes

Currently, the project can be run only via npm.  
Docker support will be added later.

---
