import stripe from "stripe";
import config from "../../../config";
import prisma from "../../utils/prisma";

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
const getVendorProductPaymentHistory = async (req: any) => {
  const isOwner = await prisma.user.findUnique({
    where: { email: req?.user.email },
    include: {
      shops: true,
    },
  });

  if (!isOwner) {
    throw new Error("Vendor not found");
  }

  const shopIds = isOwner.shops.map((shop: any) => shop.id);
  const shops = await prisma.order.findMany({
    where: {
      shopId: {
        in: shopIds,
      },
    },
    include: {
      payment: true,
      customer: true,
      shop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return shops;
};

export const PaymentServices = {
  createPaymentIntent,
  getVendorProductPaymentHistory,
};
