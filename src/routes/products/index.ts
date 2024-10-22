import { Router } from "express";

import { verifyRole, verifyToken } from "@middlewares/auth.middleware.js";
import { validateRequest } from "@middlewares/validation.middleware.js";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "@validations/product.validator.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "./product.controller.js";

const router = Router();

router.get("/", listProducts);

router.get(
  "/:id",
  validateRequest({
    paramsSchema: productIdSchema,
  }),
  getProductById
);

router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "seller"]),
  validateRequest({
    bodySchema: createProductSchema,
  }),
  createProduct
);

router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "seller"]),
  validateRequest({
    paramsSchema: productIdSchema,
    bodySchema: updateProductSchema,
  }),
  updateProduct
);

router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin"]),
  validateRequest({
    paramsSchema: productIdSchema,
  }),
  deleteProduct
);

export default router;
