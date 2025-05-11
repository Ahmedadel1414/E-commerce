import express from "express";
import dotenv from "dotenv";

import analyticsRoutes from "./routes/analytics.route.js";
import paymentRoutes from "./routes/payment.route.js";
import productRoutes from "./routes/product.route.js";
import couponRoutes from "./routes/coupon.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5050;

const __dirname = path.resolve()

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser()); // allows you to parse the cookies

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production" ) {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

app.listen(PORT, () => {
  console.log("server is running on port http://localhost:" + PORT);

  connectDB();
});
