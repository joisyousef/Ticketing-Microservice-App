import express, { type Request, type Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
} from "@elsrogy-tickets/common";
import { Order } from "../models/order.js";
import { stripe } from "../stripe.js";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === "cancelled") {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: "usd",
      payment_method: paymentMethod.id,
      confirm: true,
      return_url: "http://localhost:3000/",
      metadata: {
        orderId: order.id,
        userId: req.currentUser!.id,
      },
    });

    res.send({ success: true, id: paymentIntent.id });
  },
);

export { router as createChargeRouter };