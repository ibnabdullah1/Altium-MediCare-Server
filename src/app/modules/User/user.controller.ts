import { Request, Response } from "express";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User Created successfully!",
    data: result,
  });
});
const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userServices.getMyProfile(user as IAuthUser);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);
const profileUpdate = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.updateProfile(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Profile update successfully!",
    data: result,
  });
});
const getCustomerFollowedShops = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userServices.getCustomerFollowedShops(req);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Your following shop retrieved successfully!",
      data: result,
    });
  }
);
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUsers(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All users retrieved successfully!",
    data: result,
  });
});
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.updateUserRole(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User role update successfully!",
    data: result,
  });
});
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.updateUserStatus(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User status update successfully!",
    data: result,
  });
});
export const userController = {
  createUser,
  getMyProfile,
  profileUpdate,
  getCustomerFollowedShops,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
};
