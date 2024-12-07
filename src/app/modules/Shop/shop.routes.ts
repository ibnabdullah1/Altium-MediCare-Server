import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { shopControllers } from "./shop.controller";
import { shopValidation } from "./shop.validation";

const router = express.Router();

router.post(
  "/create-shop",
  fileUploader.upload.single("file"),
  auth(UserRole.VENDOR),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = shopValidation.createShop.parse(JSON.parse(req.body.data));
    return shopControllers.createShop(req, res, next);
  }
);
router.get("/vendor", auth(UserRole.VENDOR), shopControllers.getVendorAllShops);
router.get("/profile/:id", shopControllers.getShopProfile);

router.put(
  "/:shopId/follow",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.VENDOR),
  shopControllers.toggleFollowShop
);
router.put(
  "/:shopId",
  fileUploader.upload.single("file"),
  auth(UserRole.VENDOR),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = shopValidation.updateShop.parse(JSON.parse(req.body.data));
    return shopControllers.updateShop(req, res, next);
  }
);
router.post(
  "/review/create",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.CUSTOMER),
  shopControllers.createShopReview
);
router.delete(
  "/:shopId",
  auth(UserRole.VENDOR, UserRole.ADMIN),
  shopControllers.deleteShop
);
router.get("/", auth(UserRole.ADMIN), shopControllers.getAllShops);
router.put(
  "/update-status/:id",
  auth(UserRole.ADMIN),
  shopControllers.updateShopStatus
);
export const shopRoutes = router;
