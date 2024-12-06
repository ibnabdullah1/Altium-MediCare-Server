import { Product } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { fileUploader } from "../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import prisma from "../../utils/prisma";

const createProduct = async (req: any): Promise<Product> => {
  const files = req.files["productImages"] as IFile[];

  const isShop = await prisma.shop.findUnique({
    where: { id: req?.body.shopId },
  });

  if (!isShop) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shop not found");
  }

  const imageUrls: string[] = [];

  if (files && files.length > 0) {
    for (let file of files) {
      const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
      if (uploadToCloudinary?.secure_url) {
        imageUrls.push(uploadToCloudinary?.secure_url);
      }
    }
  }

  if (imageUrls.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "At least one image is required"
    );
  }

  // Create the product and link it to the shop
  const result = await prisma.product.create({
    data: {
      ...req.body,
      images: imageUrls,
      thumbnail: imageUrls[0],
    },
  });

  return result;
};
const vendorAllProducts = async (req: any) => {
  // Get the owner based on the logged-in user's email
  const owner = await prisma.user.findUnique({
    where: { email: req?.user?.email },
  });

  if (!owner) {
    throw new Error("Owner not found");
  }

  // Fetch all shops owned by the user and include their products
  const shopsWithProducts = await prisma.shop.findMany({
    where: {
      ownerId: owner.id,
    },
    include: {
      products: {
        include: {
          shop: true,
          reviews: true,
          orderProducts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Flatten the products array from all shops
  const allProducts = shopsWithProducts.flatMap((shop) => shop.products);

  return allProducts;
};
const allProducts = async () => {
  // Fetch all shops owned by the user and include their products
  const result = await prisma.product.findMany({
    include: {
      shop: true,
      reviews: true,
      orderProducts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const getSingleProducts = async ({ id }: any) => {
  const result = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      shop: true,
      reviews: {
        select: {
          id: true,
          content: true,
          rating: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
      orderProducts: true,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Product with ID ${id} not found.`
    );
  }

  return result;
};
const updateProduct = async ({ id }: any) => {
  const result = await prisma.product.update({
    where: {
      id: id,
    },
    data: {},
  });
  return result;
};

export const productServices = {
  createProduct,
  allProducts,
  vendorAllProducts,
  getSingleProducts,
  updateProduct,
};
