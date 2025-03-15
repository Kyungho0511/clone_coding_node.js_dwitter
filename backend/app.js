import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { initSocketIO } from "./connection/socket.js";
import { sequelize } from "./db/database.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

// Router
app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

// Error Handling
app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

// DB Connection
sequelize.sync().then(() => {
  // Start server
  const server = app.listen(config.host.port);
  // Socket.io
  initSocketIO(server);
});
