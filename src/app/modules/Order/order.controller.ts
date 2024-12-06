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
const getCustomerOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getCustomerOrders(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All orders retrieved successfully!",
    data: result,
  });
});
const getVendorOrders = catchAsync(async (req, res) => {
  const result = await orderServices.getVendorOrders(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "All orders retrieved successfully!",
    data: result,
  });
});
const updateOrderStatus = catchAsync(async (req, res) => {
  await orderServices.updateOrderStatus(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Order status successfully!",
    data: null,
  });
});
const getCustomerOrderShopList = catchAsync(async (req, res) => {
  const result = await orderServices.getCustomerOrderShopList(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Your order shop list successfully!",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  updateOrderStatus,
  getCustomerOrderShopList,
};
