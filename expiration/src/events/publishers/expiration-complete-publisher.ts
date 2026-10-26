import {
  Subjects,
  Publisher,
  type ExpirationCompleteEvent,
} from "@elsrogy-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
