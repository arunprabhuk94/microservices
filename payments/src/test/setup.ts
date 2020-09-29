import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");
// jest.mock("../stripe");

let mongo: any;

process.env.STRIPE_KEY =
  "sk_test_51HKytACmZi83IuT4xusb7HAw3bcIr0FsWXI0njdiTmwHinBpUx74bg8V5ouwEU1r0ckcBd6T3po3hactF2kwG0y900PK8PdKHZ";
beforeAll(async () => {
  process.env.JWT_KEY = "asdfdfd";

  mongo = new MongoMemoryServer({ binary: { version: "4.2.9" } });
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId(),
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };

  const sessionJson = JSON.stringify(session);
  const base64 = Buffer.from(sessionJson).toString("base64");
  return [`express:sess=${base64}`];
};
