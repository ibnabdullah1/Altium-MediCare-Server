import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const result = await orderServices.createOrder(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Order successfully!",
    data: result,
  });
});
const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getAllOrders(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All orders retrieved successfully!",
    data: result,
  });
});
export const OrderControllers = {
  createOrder,
  getAllOrders,
};
