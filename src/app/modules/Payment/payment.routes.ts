import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

router.post(
  "/payment-intent",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  PaymentControllers.createPaymentIntent
);
router.get(
  "/vendor/product-translation",
  auth(UserRole.VENDOR),
  PaymentControllers.getVendorProductPaymentHistory
);

export const PaymentRoutes = router;
