import http from "http";
import app from "./app";
import "./config/env";
import { initSocket } from "./sockets/index";
import { seedAdmin } from "./config/seed.admin";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  initSocket(server);

  server.listen(PORT, () => {
    console.log("Server started on port", PORT);
  });
};

startServer();
