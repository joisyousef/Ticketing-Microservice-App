import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@elsrogy-tickets/common";
import express, { type Request, type Response } from "express";
import { Order } from "../models/order.js";
import { OrderCancelledEvent } from "@elsrogy-tickets/common";
import { natsWrapper } from "../nats-wrapper.js";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-event.js";

const router = express.Router();

// Need to test this route
router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  },
);

export { router as deleteOrderRouter };
