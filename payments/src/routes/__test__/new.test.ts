import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@elsrogy-tickets/common";
import { app } from "../../app.js";
import { Order } from "../../models/order.js";
import { stripe } from "../../stripe.js";
import { Payment } from "../../models/payment.js";

jest.mock("../../stripe.js");

const mockedPaymentMethodsCreate = stripe.paymentMethods.create as jest.Mock;
const mockedPaymentIntentsCreate = stripe.paymentIntents.create as jest.Mock;

it("returns 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asdasda",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asdasda",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "asdfasd",
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  const paymentMethodId = "pm_test_123";
  const paymentIntentId = "pi_test_123";

  mockedPaymentMethodsCreate.mockResolvedValueOnce({
    id: paymentMethodId,
  });

  mockedPaymentIntentsCreate.mockResolvedValueOnce({
    id: paymentIntentId,
  });

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  expect(mockedPaymentMethodsCreate).toHaveBeenCalledWith({
    type: "card",
    card: { token: "tok_visa" },
  });

  const paymentIntentOptions = mockedPaymentIntentsCreate.mock.calls[0][0];

  expect(paymentIntentOptions.amount).toEqual(20 * 100);
  expect(paymentIntentOptions.currency).toEqual("usd");
  expect(paymentIntentOptions.payment_method).toEqual(paymentMethodId);
  expect(paymentIntentOptions.confirm).toEqual(true);
  expect(paymentIntentOptions.metadata.orderId).toEqual(order.id);
  expect(paymentIntentOptions.metadata.userId).toEqual(userId);

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: paymentIntentId,
  });

  expect(payment).not.toBeNull();
});
