import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getTheme, updateTheme } from "../controllers/theme.controller.js";

const router = express.Router();

router.get("/", protectRoute, getTheme);
router.put("/", protectRoute, updateTheme);

export default router;
