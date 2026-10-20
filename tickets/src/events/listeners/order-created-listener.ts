import type { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  type OrderCancelledEvent,
  type OrderCreatedEvent,
} from "@elsrogy-tickets/common";
import { queueGroupName } from "./queue-group-name.js";
import { Ticket } from "../../models/ticket.js";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket Not Found");
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}
