import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { OrderControllers } from "./order.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  OrderControllers.createOrder
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  OrderControllers.getCustomerOrders
);
router.put(
  "/update-status/:id",
  auth(UserRole.VENDOR),
  OrderControllers.updateOrderStatus
);
router.get("/vendor", auth(UserRole.VENDOR), OrderControllers.getVendorOrders);
router.get(
  "/shop-list",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.CUSTOMER),
  OrderControllers.getCustomerOrderShopList
);

export const OrderRoutes = router;
