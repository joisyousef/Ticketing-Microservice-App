import type { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  type OrderCancelledEvent,
  type OrderCreatedEvent,
} from "@elsrogy-tickets/common";
import { queueGroupName } from "./queue-group-name.js";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message){
    m
  }
}
