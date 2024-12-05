import { Review } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";

const createReview = async (req: any): Promise<Review> => {
  const isUserExists = await prisma.user.findUnique({
    where: { email: req?.user?.email },
  });

  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const isProductExist = await prisma.product.findUnique({
    where: { id: req?.body?.productId },
  });

  if (!isProductExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  if (isUserExists) {
    req.body.authorId = isUserExists.id;
  }

  // Create the shop and link it to the user as the owner
  const result = await prisma.review.create({
    data: req.body,
  });

  return result;
};
export const reviewServices = {
  createReview,
};
