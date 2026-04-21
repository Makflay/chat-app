import http from "http";
import app from "./app";
import "./config/env";
import { initSocket } from "./sockets/index";
import { seedAdmin } from "./config/seed.admin";
import { connectDB } from "./config/db";
import { ensureChatBot } from "./modules/chat/bot.chat.service";
import { ensureGroupChat } from "./modules/chat/group.chat.service";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  await ensureChatBot();
  await ensureGroupChat();
  initSocket(server);

  server.listen(PORT, () => {
    console.log("Server started on port", PORT);
  });
};

startServer();
