import type { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  type TicketUpdatedEvent,
  NotFoundError,
} from "@elsrogy-tickets/common";
import { Ticket } from "../../models/ticket.js";
import { queueGroupName } from "./queue-group-name.js";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Not Found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
  }
}
