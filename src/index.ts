import express from "express";
import "module-alias/register";

// Import the routes
import productRoutes from "./routes/products/index";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies (for form-data)
app.use(express.urlencoded({ extended: false }));

// Use the routes
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
