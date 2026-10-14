import express, { type Request, type Response } from "express";
import { NotFoundError, requireAuth } from "@elsrogy-tickets/common";
import { Ticket } from "../models/ticket.js";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  },
);

export { router as showTicketRouter };
