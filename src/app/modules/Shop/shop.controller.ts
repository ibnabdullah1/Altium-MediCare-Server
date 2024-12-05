import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { shopServices } from "./shop.service";

const createShop = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.createShop(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Shop Created successfully!",
    data: result,
  });
});
const getAllShops = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.getAllShops(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All shop retrieved successfully!",
    data: result,
  });
});
const getShopProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.getShopProfile(req.params);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Shop Profile successfully!",
    data: result,
  });
});
const toggleFollowShop = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.toggleFollowShop(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: result.message,
    data: "",
  });
});

export const shopControllers = {
  createShop,
  getShopProfile,
  getAllShops,
  toggleFollowShop,
};
