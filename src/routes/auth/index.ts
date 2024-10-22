import { validateRequest } from "@middlewares/validation.middleware";
import { createUserSchema, loginUserSchema } from "@validations/user.validator";
import { Router } from "express";
import { loginUser, registerUser } from "./user.controller";

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
