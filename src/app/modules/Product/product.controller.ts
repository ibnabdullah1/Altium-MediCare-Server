import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productServices } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.createProduct(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product Created successfully!",
    data: result,
  });
});
const vendorAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.vendorAllProducts(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product Retrieved successfully!",
    data: result,
  });
});
const allProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.allProducts();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product Retrieved successfully!",
    data: result,
  });
});
const getSingleProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.getSingleProducts(req.params);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Product Retrieved successfully!",
    data: result,
  });
});

export const productControllers = {
  createProduct,
  allProducts,
  vendorAllProducts,
  getSingleProducts,
};
