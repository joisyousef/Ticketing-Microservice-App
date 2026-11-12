import mongoose from "mongoose";
import { type Message } from "node-nats-streaming";
import {
  OrderStatus,
  type ExpirationCompleteEvent,
} from "@elsrogy-tickets/common";
import { natsWrapper } from "../../../nats-wrapper.js";
import { ExpirationCompleteListener } from "../expiration-complete-listener.js";
import { Ticket } from "../../../models/ticket.js";
import { Order } from "../../../models/order.js";
import { listen } from "node:quic";
import type { Mock } from "node:test";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "qwert",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  (natsWrapper.client.publish as jest.Mock).mock.calls[0]
});

it("ack the message", async () => {
  const { listener, order, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
});
