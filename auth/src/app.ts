import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user.js";
import { signinRouter } from "./routes/signin.js";
import { signoutRouter } from "./routes/signout.js";
import { signupRouter } from "./routes/signup.js";
import { errorhandler } from "./middlewares/error-handler.js";
import { NotFoundError } from "./errors/not-found-error.js";

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorhandler);

export { app };
