import { User, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { fileUploader } from "../../helpers/fileUploader";
import { IAuthUser } from "../../interfaces/common";
import { IFile } from "../../interfaces/file";
import prisma from "../../utils/prisma";

const createUser = async (req: Request): Promise<User> => {
  const file = req.file as IFile;

  // Check if user already exists
  const isUserExists = await prisma.user.findUnique({
    where: { email: req.body.user.email },
  });
  if (isUserExists) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "A user with the provided email already exists."
    );
  }

  // Handle file upload if present
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.user.profilePhoto = uploadToCloudinary?.secure_url;
  }

  // Hash the password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // Prepare user data with all required fields
  const userData = {
    name: req.body.user.name,
    email: req.body.user.email,
    password: hashedPassword,
    role: UserRole.CUSTOMER,
    profilePhoto: req.body.user.profilePhoto || null,
  };

  // Create the user
  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};
const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      shops: true,
      followedShops: true,
      reviews: true,
      orders: true,
      Product: true,
    },
  });

  return userInfo;
};
export const userServices = {
  createUser,
  getMyProfile,
};
