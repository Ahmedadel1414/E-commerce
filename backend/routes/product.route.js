import express from "express";
import {
  getFeaturedProducts,
  getAllProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRout } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getAllProducts", protectRoute, adminRout, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/add-new-product", protectRoute, adminRout, createProduct);
router.patch("/featured/:id", protectRoute, adminRout, toggleFeaturedProduct);
router.delete("/delete-product/:id", protectRoute, adminRout, deleteProduct);

export default router;
