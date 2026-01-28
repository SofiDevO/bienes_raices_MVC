import express from "express";
import {
  emailConfirmation,
  forgotPasswordForm,
  loginForm,
  newPassword,
  register,
  registerForm,
  resetPassword,
  verifyTokenForm,
  authenticateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/register", registerForm);
router.post("/register", register);

router.get("/confirm/:token", emailConfirmation);

router.get("/login", loginForm);
router.post("/login", authenticateUser);

router.get("/forgot-password", forgotPasswordForm);
router.post("/reset-password", resetPassword);

// save new password
router.get("/reset-password/:token", verifyTokenForm);
router.post("/reset-password/:token", newPassword);

export default router;
