import express from "express";
import { adminRout, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRout, getAnalytics)

export default router;