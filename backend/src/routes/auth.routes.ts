import { Router } from "express";
import * as AuthController from "../modules/auth/auth.controller";
import { protect } from "../modules/auth/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("login", AuthController.login);
router.get("/me", protect, AuthController.getCurrentUser);

export default router;
