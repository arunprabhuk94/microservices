import { Publisher, Subjects, TicketUpdatedEvent } from "@arptickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
