import express from "express";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts
} from "../controllers/cart.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get-cart-items", protectRoute, getCartProducts);
router.post("/add-to-cart", protectRoute, addToCart);
router.delete("/delete-from-cart", protectRoute, removeAllFromCart);
router.put("/update-quantity/:id", protectRoute, updateQuantity);

export default router;
