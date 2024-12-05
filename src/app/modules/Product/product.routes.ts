import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import auth from "../../middlewares/auth";
import { productControllers } from "./product.controller";
import { productValidation } from "./product.validation";

const router = express.Router();

router.post(
  "/create-product",
  fileUploader.upload.fields([{ name: "productImages" }]),
  auth(UserRole.VENDOR),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = productValidation.createProduct.parse(JSON.parse(req.body.data));
    return productControllers.createProduct(req, res, next);
  }
);
router.get(
  "/vendor-product",
  auth(UserRole.VENDOR),
  productControllers.vendorAllProducts
);
router.get("/:id", productControllers.getSingleProducts);
router.get("/", productControllers.allProducts);

export const productRoutes = router;
