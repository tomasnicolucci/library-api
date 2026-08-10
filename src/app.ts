import express from "express";
import authRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

export default app;