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
const updateShop = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.updateShop(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Shop updated successfully!",
    data: result,
  });
});
const getVendorAllShops = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.getVendorAllShops(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All shop retrieved successfully!",
    data: result,
  });
});
const getVendorShopReview = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.getVendorShopReview(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All shop review retrieved successfully!",
    data: result,
  });
});
const getShopReview = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.getShopReview(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All shop review retrieved successfully!",
    data: result,
  });
});
const getAllShops = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.getAllShops();
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
const createShopReview = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.createShopReview(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Review send successfully!",
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
const updateShopStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await shopServices.updateShopStatus(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Shop status update successfully!",
    data: result,
  });
});
const deleteShop = catchAsync(async (req: Request, res: Response) => {
  await shopServices.deleteShop(req.params.shopId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Shop deleted successfully!",
    data: null,
  });
});

export const shopControllers = {
  createShop,
  updateShop,
  getShopProfile,
  getAllShops,
  toggleFollowShop,
  createShopReview,
  deleteShop,
  getVendorAllShops,
  updateShopStatus,
  getVendorShopReview,
  getShopReview,
};
