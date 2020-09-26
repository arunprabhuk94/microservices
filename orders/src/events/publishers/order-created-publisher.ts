import { Publisher, OrderCreatedEvent, Subjects } from "@arptickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
