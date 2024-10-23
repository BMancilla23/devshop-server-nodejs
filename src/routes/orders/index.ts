import { Router } from "express";
import { createOrder } from "./order.controller.js";
import { validateRequest } from "@middlewares/validation.middleware.js";
import { verifyToken } from "@middlewares/auth.middleware.js";
import {
  createOrderSchema,
  createOrderWithItemsSchema,
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

export default router;
