import { Subjects, Publisher, PaymentCreatedEvent } from "@arptickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
