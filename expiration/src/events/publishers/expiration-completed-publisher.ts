import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from "@arptickets/common";

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  readonly subject = Subjects.ExpirationCompleted;
}
