import express from "express";
import "module-alias/register.js"; // Esto permite resolver las rutas definidas en tsconfig.json
import serveless from "serverless-http";

// Import the routes
import productRoutes from "./routes/products/index.js";
import authRoutes from "./routes/auth/index.js";
import orderRoutes from "./routes/orders/index.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies (for form-data)
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Use the routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

if (process.env.NODE_ENV === "dev") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export const handler = serveless(app);
