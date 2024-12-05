import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.createReview(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Review send successfully!",
    data: result,
  });
});
export const reviewControllers = {
  createReview,
};
