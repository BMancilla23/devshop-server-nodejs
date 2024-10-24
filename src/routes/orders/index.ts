import { Router } from "express";
import {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
} from "./order.controller.js";
import { validateRequest } from "@middlewares/validation.middleware.js";
import { verifyToken } from "@middlewares/auth.middleware.js";
import {
  createOrderSchema,
  createOrderWithItemsSchema,
  orderIdSchema,
  updateOrderSchema,
} from "@validations/order.validator.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateRequest({
    bodySchema: createOrderWithItemsSchema,
  }),
  createOrder
);

router.get("/", verifyToken, listOrders);

router.get(
  "/:id",
  verifyToken,
  validateRequest({
    paramsSchema: orderIdSchema,
  }),
  getOrder
);

router.put(
  "/:id",
  verifyToken,
  validateRequest({
    paramsSchema: orderIdSchema,
    bodySchema: updateOrderSchema,
  }),
  updateOrder
);

export default router;
