import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return a 404 when purchasing an order that does not exists", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: new mongoose.Types.ObjectId().toHexString(),
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });
});

it("return a 401 when purchasing an order that does not belong to the user", async () => {});

it("return a 400 when purchasing a cancelled order", async () => {});
