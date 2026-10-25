import type { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import {
  Subjects,
  Listener,
  type OrderCreatedEvent,
} from "@elsrogy-tickets/common";
import { expirationQueue } from "../../queues/expiration-queue.js";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add({
      orderId: data.id,
    });

    msg.ack();
  }
}
