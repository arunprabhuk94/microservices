import request from "supertest";
import { app } from "../../app";

const createTicket = (ticketInfo: { title: string; price: number }) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(ticketInfo);
};

it("can fetch a list of tickets", async () => {
  const ticketInto = {
    title: "ticky",
    price: 20,
  };
  await createTicket(ticketInto);
  await createTicket(ticketInto);
  await createTicket(ticketInto);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toBe(3);
});
