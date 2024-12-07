import { Shop } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { fileUploader } from "../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import prisma from "../../utils/prisma";

const createShop = async (req: any): Promise<Shop> => {
  const file = req.file as IFile;
  const isOwner = await prisma.user.findUnique({
    where: { email: req?.user.email },
  });

  if (!isOwner) {
    throw new ApiError(httpStatus.NOT_FOUND, "Owner not found");
  }

  // Handle file upload if present
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.logo = uploadToCloudinary?.secure_url;
  }

  // Create the shop and link it to the user as the owner
  const result = await prisma.shop.create({
    data: {
      ...req.body,
      owner: {
        connect: { id: isOwner.id },
      },
    },
  });

  return result;
};
const getVendorAllShops = async (req: any) => {
  const isOwner = await prisma.user.findUnique({
    where: { email: req?.user.email },
  });

  const shops = await prisma.shop.findMany({
    where: {
      ownerId: isOwner?.id,
    },
    include: {
      owner: true,
      products: true,
      orders: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return shops;
};
const getShopProfile = async ({ id }: any) => {
  const shopProfile = await prisma.shop.findUnique({
    where: {
      id: id,
    },
    include: {
      owner: true,
      products: true,
      orders: true,
      followers: true,
    },
  });

  if (!shopProfile) {
    new ApiError(httpStatus.NOT_FOUND, "ShopProfile not found");
  }
  return shopProfile;
};
const toggleFollowShop = async (req: any) => {
  const { shopId } = req.params;

  // Validate user existence
  const isUser = await prisma.user.findUnique({
    where: { email: req?.user.email },
    include: {
      followedShops: true, // Include followed shops to check the relationship
    },
  });

  if (!isUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid Token");
  }

  try {
    // Ensure the shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new ApiError(httpStatus.NOT_FOUND, "Shop not found");
    }

    // Check if the user is already following the shop
    const isFollowing = isUser.followedShops.some(
      (followedShop: any) => followedShop.id === shopId
    );

    if (isFollowing) {
      // Unfollow the shop (remove from followedShops)
      await prisma.user.update({
        where: { id: isUser.id },
        data: {
          followedShops: {
            disconnect: { id: shopId },
          },
        },
      });

      // Remove the user from the shop's followers
      await prisma.shop.update({
        where: { id: shopId },
        data: {
          followers: {
            disconnect: { id: isUser.id },
          },
        },
      });

      return { message: "Shop unfollowed successfully" };
    } else {
      // Follow the shop (add to followedShops)
      await prisma.user.update({
        where: { id: isUser.id },
        data: {
          followedShops: {
            connect: { id: shopId },
          },
        },
      });

      // Add the user to the shop's followers
      await prisma.shop.update({
        where: { id: shopId },
        data: {
          followers: {
            connect: { id: isUser.id },
          },
        },
      });

      return { message: "Shop followed successfully" };
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to toggle follow state");
  }
};

const updateShop = async (req: any): Promise<Shop> => {
  const file = req?.file as IFile;
  const { shopId } = req?.params;

  const isOwner = await prisma.user.findUnique({
    where: { email: req?.user?.email },
  });

  if (!isOwner) {
    throw new ApiError(httpStatus.NOT_FOUND, "Owner not found");
  }

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shop not found");
  }
  // Handle file upload if present
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.logo = uploadToCloudinary?.secure_url;
  }

  // Update the shop
  const updatedShop = await prisma.shop.update({
    where: {
      id: shopId,
    },
    data: req?.body,
  });

  return updatedShop;
};
const createShopReview = async (req: any) => {
  const isUser = await prisma.user.findUnique({
    where: { email: req?.user.email },
  });
  const { rating, shopIds, content } = req.body;
  if (!isUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (isUser) {
    req.body.authorId = isUser.id;
  }

  const reviews = [];
  for (const shopId of shopIds) {
    const review = await prisma.shopReview.create({
      data: {
        rating,
        shopId,
        content,
        authorId: req.body.authorId,
      },
    });
    reviews.push(review);
  }

  return reviews;
};

const deleteShop = async (id: string): Promise<Shop> => {
  const result = await prisma.shop.delete({
    where: {
      id,
    },
  });
  return result;
};

const getAllShops = async () => {
  const result = await prisma.shop.findMany({
    include: {
      _count: {
        select: {
          shopReview: true,
          products: true,
          orders: true,
          followers: true,
        },
      },
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const updateShopStatus = async (req: any) => {
  const shop = await prisma.shop.update({
    where: {
      id: req?.params?.id,
    },
    data: {
      status: req?.body?.status,
    },
  });
  return shop;
};
const getVendorShopReview = async (req: any) => {
  const isOwner = await prisma.user.findUnique({
    where: { email: req?.user.email },
  });

  const shops = await prisma.shop.findMany({
    where: {
      ownerId: isOwner?.id,
    },
    include: {
      shopReview: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return shops;
};
const getShopReview = async (req: any) => {
  const shops = await prisma.shop.findMany({
    include: {
      shopReview: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return shops;
};
export const shopServices = {
  createShop,
  updateShop,
  getShopProfile,
  getAllShops,
  getVendorAllShops,
  toggleFollowShop,
  createShopReview,
  getVendorShopReview,
  deleteShop,
  getShopReview,
  updateShopStatus,
};
