import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { initSocketIO } from "./connection/socket.js";
import { db } from "./db/database.js";

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

// Connect to DB
db.getConnection().then((connection) => console.log(connection));

// Start server
const server = app.listen(config.host.port);

// Socket.io
initSocketIO(server);
