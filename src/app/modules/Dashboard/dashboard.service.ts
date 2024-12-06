import { PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

const prisma = new PrismaClient();

const getCustomerStats = async (req: any) => {
  const isCustomer = await prisma.user.findUnique({
    where: { email: req?.user.email },
  });

  const totalOrders = await prisma.order.count({
    where: { customerId: isCustomer?.id },
  });

  const totalPayment = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  const totalProductsPurchased = await prisma.orderProduct.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      order: {
        customerId: isCustomer?.id,
      },
    },
  });

  const recentOrder = await prisma.order.findFirst({
    where: { customerId: isCustomer?.id },
    orderBy: { createdAt: "desc" },
    include: {
      products: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  const totalReviews = await prisma.review.count({
    where: { authorId: isCustomer?.id },
  });

  const flashSalePurchases = await prisma.orderProduct.aggregate({
    _sum: {
      quantity: true,
    },
    where: {
      product: {
        isFlashSale: true,
      },
      order: {
        customerId: isCustomer?.id,
      },
    },
  });

  return {
    totalOrders,
    totalPayment: totalPayment._sum.totalAmount || 0,
    totalProductsPurchased: totalProductsPurchased._sum.quantity || 0,
    totalReviews,
    flashSalePurchases: flashSalePurchases._sum.quantity || 0,
    recentOrder,
  };
};

const getVendorStats = async (req: any) => {
  try {
    // Fetch vendor details based on the email and ensure the role is 'VENDOR'
    const isVendor = await prisma.user.findUnique({
      where: { email: req?.user.email },
      include: {
        shops: true, // Include the vendor's shops
      },
    });

    // Check if the user is a vendor and has at least one shop
    if (!isVendor || !isVendor.shops.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Vendor or shop not found");
    }

    const shopIds = isVendor.shops.map((shop) => shop.id); // Get all shop IDs for the vendor

    // Get the total products across all the vendor's shops
    const totalProducts = await prisma.product.count({
      where: {
        shopId: {
          in: shopIds,
        },
      },
    });

    // Get the total revenue from the orders in the vendor's shops
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        totalAmount: true, // Sum of the totalAmount from all orders
      },
      where: {
        shopId: {
          in: shopIds, // Filter orders by shop IDs
        },
      },
    });

    // Get the total number of orders for the vendor's shops
    const totalOrders = await prisma.order.count({
      where: {
        shopId: {
          in: shopIds,
        },
      },
    });

    // Get the total number of reviews for the vendor's products
    const totalReviews = await prisma.review.count({
      where: {
        product: {
          shopId: {
            in: shopIds,
          },
        },
      },
    });

    // Get the average rating for the vendor's products
    const averageRating = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        product: {
          shopId: {
            in: shopIds,
          },
        },
      },
    });

    return {
      totalProducts,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders,
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, `Error fetching vendor stats`);
  }
};

export const dashboardServices = {
  getCustomerStats,
  getVendorStats,
};
