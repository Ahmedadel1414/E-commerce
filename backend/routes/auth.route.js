import express from "express";

import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);
route.post("/refresh-token", refreshToken);

route.get("/profile", protectRoute, getProfile);

export default route;
