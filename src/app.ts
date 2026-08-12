import express from "express";
import authRouter from "./routes/auth.routes.js";
import authorRouter from "./routes/author.routes.js";
import bookRouter from "./routes/book.routes.js";
import loanRouter from "./routes/loan.routes.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/loans", loanRouter);

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

export default app;