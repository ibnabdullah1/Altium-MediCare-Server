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
  OrderControllers.getAllOrders
);

export const OrderRoutes = router;
