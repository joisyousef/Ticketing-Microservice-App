import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  errorhandler,
  NotFoundError,
  currentUser,
} from "@elsrogy-tickets/common";
import { createTicketRouter } from "./routes/new.js";

const app = express();
app.set("trust proxy", true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    // secure: true,
    secure: process.env.NODE_ENV !== "test",
  }),
);

app.use(currentUser);
app.use(createTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorhandler);

export { app };
