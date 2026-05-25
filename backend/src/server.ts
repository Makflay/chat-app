import http from "http";
import app from "./app";
import { env } from "./config/env.config";
import { initSocket } from "./sockets/index";
import { seedAdmin } from "./config/seed.admin";
import { connectDB } from "./config/db";
import { ensureChatBot } from "./modules/chat/bot/bot.chat.service";
import { ensureGroupChat } from "./modules/chat/chat.group.service";

const PORT = env.PORT;
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
