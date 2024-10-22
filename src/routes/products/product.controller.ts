import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "@db/index";
import {
  CreateProductInput,
  ProductIdInput,
  UpdateProductInput,
} from "@validations/product.validator";
import { productsTable } from "@db/schemas/products";

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await db.select().from(productsTable);

    res.json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    /* console.error(error); */
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const getProductById = async (
  req: Request<ProductIdInput>,
  res: Response
): Promise<void> => {
  try {
    const { id }: ProductIdInput = req.params;

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, +id)); // +id para asegurar que es un número

    // Si el producto no existe, retornar un estado 404 (no encontrado)
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Retorna el producto encontrado en formato JSON
    res.json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    /* console.error(error); */
    // Manejo de errores genéricos
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const createProduct = async (
  req: Request<unknown, CreateProductInput>,
  res: Response
) => {
  /*  console.log(req.body);
   */
  try {
    console.log(req.userId);

    const data: CreateProductInput = req.body;

    const [product] = await db.insert(productsTable).values(data).returning(); // Retorna el producto recién creado

    /* console.log(product); */

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error: unknown) {
    /* console.error(e); */
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const updateProduct = async (
  req: Request<ProductIdInput, UpdateProductInput>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const data: UpdateProductInput = req.body;

    const [product] = await db
      .update(productsTable)
      .set(data)
      .where(eq(productsTable.id, +id)) // Busca el producto con el ID correspondiente
      .returning(); // Retorna el producto actualizsdo

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return; // Aquí es importante el return para detener el flujo
    }

    res.json({ message: "Product updated successfully", data: product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
    return; // Por consistencia, añadimos return aquí también
  }
};

export const deleteProduct = async (
  req: Request<ProductIdInput>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, +id))
      .returning();

    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(204).json({ message: "Product deleted successfully" });
    return;
  } catch (error) {
    /* console.error(error); */
    res.status(500).json({ message: "Internal server error", error: error });
    return; // Se recomienda añadir return en catch para mantener consistencia
  }
};
