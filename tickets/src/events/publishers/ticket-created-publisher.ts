import { Publisher, Subjects, TicketCreatedEvent } from "@arptickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
