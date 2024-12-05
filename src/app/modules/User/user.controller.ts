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

export const userController = {
  createUser,
  getMyProfile,
};
