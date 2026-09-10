import express from "express";
import { currentUserRouter } from "./routes/current-user.js";

const app = express();
app.use(express.json());

app.use(currentUserRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});