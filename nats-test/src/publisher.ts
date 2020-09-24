import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://127.0.0.1:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = {
    id: "123",
    title: "ticky",
    price: 20,
  };

  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish(data);
});
