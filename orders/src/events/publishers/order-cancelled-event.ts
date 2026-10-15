import {
  Publisher,
  Subjects,
  type OrderCancelledEvent,
} from "@elsrogy-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}