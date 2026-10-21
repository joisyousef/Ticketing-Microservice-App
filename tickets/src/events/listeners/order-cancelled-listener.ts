import type { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  type OrderCancelledEvent,
} from "@elsrogy-tickets/common";
import { queueGroupName } from "./queue-group-name.js";
import { Ticket } from "../../models/ticket.js";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher.js";

export class OrderCancelledListener extends Listener<OrderCancelledListener> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket Not Foudn");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId!,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });
    
    msg.ack();
  }
}
