import { Router } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from "../../validations/product.validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "./product.controller";

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
  validateRequest({
    bodySchema: createProductSchema,
  }),
  createProduct
);

router.put(
  "/:id",
  validateRequest({
    paramsSchema: productIdSchema,
    bodySchema: updateProductSchema,
  }),
  updateProduct
);

router.delete(
  "/:id",
  validateRequest({
    paramsSchema: productIdSchema,
  }),
  deleteProduct
);

export default router;
