import { type Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  type ExpirationCompleteEvent,
  OrderStatus,
} from "@elsrogy-tickets/common";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-event.js";
import { natsWrapper } from "../../nats-wrapper.js";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order Not Found");
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
