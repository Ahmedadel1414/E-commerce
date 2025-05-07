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

router.get("/", protectRoute, adminRout, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRout, createProduct);
router.patch("/:id", protectRoute, adminRout, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRout, deleteProduct);

export default router;
