import stripe from "stripe";
import config from "../../../config";

const stripeClient = new stripe(config.stripe_secret_key as string);
const createPaymentIntent = async (price: number) => {
  const amount = Math.round(price * 100);
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent.client_secret;
};

export const PaymentServices = {
  createPaymentIntent,
};
