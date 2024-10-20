import { Request, Response } from "express";
import { db } from "../../db/index";
import { productsTable } from "../../db/schemas/products";
import { eq } from "drizzle-orm";

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await db.select().from(productsTable);

    res.json({ message: "Products retrieved successfully", data: products });
  } catch (error) {
    /* console.error(error); */
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Agregar ordenar por id

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, +id)); // +id para asegurar que es un número

    // Si el producto no existe, retornar un estado 404 (no encontrado)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Retorna el producto encontrado en formato JSON
    res.json({ message: "Product retrieved successfully", data: product });
  } catch (error) {
    /* console.error(error); */
    // Manejo de errores genéricos
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  /*  console.log(req.body);
   */
  try {
    const [product] = await db
      .insert(productsTable)
      .values(req.body)
      .returning(); // Retorna el producto recién creado

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

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [product] = await db
      .update(productsTable)
      .set(req.body)
      .where(eq(productsTable.id, +id)) // Busca el producto con el ID correspondiente
      .returning(); // Retorna el producto actualizsdo

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", data: product });
  } catch (error) {}
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, +id))
      .returning();

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    /* console.error(error); */
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
