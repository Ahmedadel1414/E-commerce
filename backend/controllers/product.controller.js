import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

import { redis } from "../lib/redis.js";

// getAllProducts controller
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
// getFeaturedProducts controller
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products"); // get featured products from redis
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // if not in redis fetch from mongodb
    // lean() is gonna return a plain js object instead of mongoose document
    // witch is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean(); // find all featured products

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
// createProduct controller
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    let cludinaryResponse = null;

    if (image) {
      cludinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cludinaryResponse?.secure_url ? cludinaryResponse?.secure_url : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
// deleteProduct controller
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // get image id
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("image deleted from cloudinary");
      } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
// getRecommendedProducts controller
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
// getProductsByCategory controller
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({products});
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
// toggleFeaturedProduct controller
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // lean() is gonna return a plain js object instead of mongoose document
    // witch is good for performance
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in updateFeaturedProductsCache", error.message);
  }
}
