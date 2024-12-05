import { Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createOrder = async (req: any): Promise<Order> => {
  try {
    const isUserExists = await prisma.user.findUnique({
      where: { email: req?.user?.email },
    });
    console.log(req?.user?.email);
    if (!isUserExists) {
      throw new Error("User not found");
    }
    if (isUserExists) {
      req.body.customerId = isUserExists.id;
    }
    const { customerId, shopId, products, totalAmount, payment, address } =
      req.body;

    // Validate request payload
    if (!shopId || !products || !payment || !totalAmount) {
      throw new Error("Missing required fields");
    }

    const result = await prisma.$transaction(async (transactionClient) => {
      // Create a payment record
      const createdPayment = await transactionClient.payment.create({
        data: {
          method: payment.method,
          status: payment.status,
          transactionId: payment?.transactionId ? payment?.transactionId : null,
        },
      });

      // Create an order record
      const createdOrder = await transactionClient.order.create({
        data: {
          customerId,
          shopId,
          totalAmount,
          address,
          paymentId: createdPayment.id,
          paymentStatus: payment.status,
          shippingStatus: "PENDING",
        },
      });

      // Add associated products to the order
      const orderProductsData = products.map((product: any) => ({
        orderId: createdOrder.id,
        productId: product.productId,
        shopId: product.shopId,
        quantity: product.quantity,
      }));

      await transactionClient.orderProduct.createMany({
        data: orderProductsData,
      });

      return createdOrder;
    });

    console.log("Order created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
const getAllOrders = async (req: any) => {
  const isOwner = await prisma.user.findUnique({
    where: { email: req?.user.email },
  });

  const orders = await prisma.order.findMany({
    where: {
      customerId: isOwner?.id,
    },
    include: {
      customer: true,
      payment: true,
      shop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};
export const orderServices = {
  createOrder,
  getAllOrders,
};
