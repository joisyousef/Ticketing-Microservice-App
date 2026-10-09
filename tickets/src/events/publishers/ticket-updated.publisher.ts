import {
  Publisher,
  Subjects,
  type TicketUpdatedEvent,
} from "@elsrogy-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}