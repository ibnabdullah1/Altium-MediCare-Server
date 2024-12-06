import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { dashboardServices } from "./dashboard.service";

const getCustomerStats = catchAsync(async (req, res) => {
  const result = await dashboardServices.getCustomerStats(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Customer stats retrieved successfully",
    data: result,
  });
});
const getVendorStats = catchAsync(async (req, res) => {
  const result = await dashboardServices.getVendorStats(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const dashboardControllers = {
  getCustomerStats,
  getVendorStats,
};
