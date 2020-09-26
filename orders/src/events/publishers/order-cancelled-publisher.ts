import { Publisher, OrderCancelledEvent, Subjects } from "@arptickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
