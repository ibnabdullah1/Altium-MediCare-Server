import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

const prisma = new PrismaClient();

const createOrder = async (req: any) => {
  try {
    const isUserExists = await prisma.user.findUnique({
      where: { email: req?.user?.email },
    });
    if (!isUserExists) {
      throw new Error("User not found");
    }
    req.body.customerId = isUserExists.id;

    const { customerId, orders } = req.body;

    // Validate request payload
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Missing required fields: orders"
      );
    }

    const results = await prisma.$transaction(async (transactionClient) => {
      const createdOrders = [];

      for (const order of orders) {
        const { shopId, products, totalAmount, payment, address } = order;

        if (!shopId || !products || !payment || !totalAmount) {
          throw new Error("Missing required fields in order");
        }

        // Create a payment record
        const createdPayment = await transactionClient.payment.create({
          data: {
            method: payment.method,
            status: payment.status,
            transactionId: payment?.transactionId || null,
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

        // Update product quantities in inventory in one go to avoid multiple calls
        const productUpdates = products.map(async (product: any) => {
          const { productId, quantity } = product;

          // Fetch the current stock of the product
          const currentProduct = await transactionClient.product.findUnique({
            where: { id: productId },
          });

          if (!currentProduct) {
            throw new Error(`Product with ID ${productId} not found`);
          }

          if (currentProduct.inventory < quantity) {
            throw new Error(
              `Insufficient stock for product ID ${productId}. Available: ${currentProduct.inventory}, Requested: ${quantity}`
            );
          }

          // Deduct the ordered quantity from the stock
          await transactionClient.product.update({
            where: { id: productId },
            data: {
              inventory: currentProduct.inventory - quantity,
            },
          });
        });

        // Wait for all the product stock updates to complete
        await Promise.all(productUpdates);

        createdOrders.push(createdOrder);
      }

      return createdOrders;
    });

    return results;
  } catch (error) {
    new ApiError(httpStatus.BAD_REQUEST, "Error creating orders");
  } finally {
    await prisma.$disconnect();
  }
};

const getCustomerOrders = async (req: any) => {
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
      products: {
        include: {
          product: true,
          order: true,
        },
      },
      shop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};
const getCustomerOrderShopList = async (req: any) => {
  const isOwner = await prisma.user.findUnique({
    where: { email: req?.user?.email },
  });

  if (!isOwner) {
    throw new Error("User not found");
  }

  const shops = await prisma.order.findMany({
    where: {
      customerId: isOwner.id,
    },
    include: {
      shop: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const shopList = shops.map((order) => ({
    level: order.shop?.name || "Unknown Shop",
    value: order.shop?.id,
  }));
  const uniqueShopList = Array.from(
    new Map(shopList?.map((shop) => [shop.value, shop])).values()
  );

  return uniqueShopList;
};

const getVendorOrders = async (req: any) => {
  // Fetch the user (vendor) based on their email
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
  // Fetch all orders for the vendor's shops
  const orders = await prisma.order.findMany({
    where: {
      shopId: {
        in: shopIds, // Filter by vendor's shop IDs
      },
    },
    include: {
      products: true,
      shop: true,
      customer: {
        select: {
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const updateOrderStatus = async ({ orderId, action, status }: any) => {
  if (action === "PAYMENT") {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status,
      },
    });
  } else if (action === "SHIPPING") {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingStatus: status,
      },
    });
  }
};

export const orderServices = {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  updateOrderStatus,
  getCustomerOrderShopList,
};
