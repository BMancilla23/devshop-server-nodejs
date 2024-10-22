import { validateRequest } from "@middlewares/validation.middleware.js";

import { Router } from "express";
import { loginUser, registerUser } from "./user.controller.js";
import {
  createUserSchema,
  loginUserSchema,
} from "@validations/user.validator.js";

const router = Router();

// Route register

router.post(
  "/register",
  validateRequest({
    bodySchema: createUserSchema,
  }),
  registerUser
);

// Route login

router.post(
  "/login",
  validateRequest({
    bodySchema: loginUserSchema,
  }),
  loginUser
);

// Route profile

export default router;
