import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import { requireAuth, validateRequest } from "@elsrogy-tickets/common";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send("Order created");
  },
);

export { router as newOrderRouter };
