import {
  Publisher,
  Subjects,
  type OrderCreatedEvent,
} from "@elsrogy-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}