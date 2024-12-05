import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { reviewControllers } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.CUSTOMER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = reviewValidation.createReview.parse(req.body);
    return reviewControllers.createReview(req, res, next);
  }
);

export const reviewRoutes = router;
