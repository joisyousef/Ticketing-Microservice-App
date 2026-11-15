import {
  Subjects,
  Publisher,
  type PaymentCreatedEvent,
} from "@elsrogy-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
