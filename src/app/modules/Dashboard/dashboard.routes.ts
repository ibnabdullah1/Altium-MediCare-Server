import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { dashboardControllers } from "./dashboard.controller";

const router = express.Router();

router.get(
  "/customer-stats",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  dashboardControllers.getCustomerStats
);
router.get(
  "/vendor-stats",
  auth(UserRole.VENDOR),
  dashboardControllers.getVendorStats
);

export const dashboardRoutes = router;
