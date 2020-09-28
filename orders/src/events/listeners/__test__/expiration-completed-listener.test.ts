import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompletedListener } from "../expiration-completed-listener";
import mongoose from "mongoose";
import { ExpirationCompletedEvent, OrderStatus } from "@arptickets/common";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  //@ts-ignore
  natsWrapper.client.publish.mockClear();

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const publishCall = natsWrapper.client.publish as jest.Mock;
  const eventData = JSON.parse(publishCall.mock.calls[0][1]);
  expect(publishCall).toHaveBeenCalled();
  expect(eventData.id).toBe(order.id);
});

it("acks the message", async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
