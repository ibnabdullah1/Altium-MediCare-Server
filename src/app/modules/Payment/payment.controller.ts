import { RequestHandler } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const createPaymentIntent: RequestHandler = catchAsync(async (req, res) => {
  const { price } = req.body;
  const clientSecret = await PaymentServices.createPaymentIntent(price);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Payment intent created successfully",
    data: { clientSecret },
  });
});

const getVendorProductPaymentHistory = catchAsync(async (req, res) => {
  const result = await PaymentServices.getVendorProductPaymentHistory(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully!",
    data: result,
  });
});
const getProductPaymentHistory = catchAsync(async (req, res) => {
  const result = await PaymentServices.getProductPaymentHistory();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully!",
    data: result,
  });
});

export const PaymentControllers = {
  createPaymentIntent,
  getVendorProductPaymentHistory,
  getProductPaymentHistory,
};
