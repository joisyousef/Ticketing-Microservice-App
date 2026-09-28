import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorhandler, NotFoundError } from "@elsrogy-tickets/common";

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

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorhandler);

export { app };
