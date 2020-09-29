import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@arptickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").notEmpty(), body("orderId").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    const customer = await stripe.customers.create({
      email: "test@test.com",
      source: token,
    });
    const charge = await stripe.charges.create({
      currency: "inr",
      amount: order.price * 100,
      customer: customer.id,
      description: "A payment for ticketing",
      shipping: {
        name: "Arun",
        address: {
          city: "Tenkasi",
          country: "India",
          line1: "Thoranamalai Road",
        },
      },
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
