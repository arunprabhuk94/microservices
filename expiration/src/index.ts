import { randomBytes } from "crypto";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  const requiredEnvs = ["NATS_CLUSTER_ID", "NATS_CLIENT_ID", "NATS_URL"];
  for (const envVar of requiredEnvs) {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} must be defined`);
    }
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
