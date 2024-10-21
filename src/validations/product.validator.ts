import { productsTable } from "@db/schemas/products";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Esquema para la creación de productos
export const createProductSchema = createInsertSchema(productsTable)
  .omit({
    id: true, // Omitimos el ID para la creación
  })
  .strict(); // No permite propiedades adicionales;

// Validación del ID del producto (para rutas con :id)
export const productIdSchema = z.object({
  id: z
    .string()
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      "ID must be a positive number"
    ),
});

// Esquema para la actualización de productos (puede incluir o no los campos)
export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    id: true, // Omitimos el ID para la actualización
  })
  .partial() // Los campos son opcionales para la actualización
  .extend({
    price: z.coerce
      .number() //Convierte el valor a número si es cadena
      .refine((value) => !isNaN(value), "Price must be a valid number") // Asegura que sea un número válido
      .optional(),
    quantity: z.coerce
      .number() // Convierte el valor a número si es cadena
      .refine((value) => !isNaN(value), "Quantity must be a valid number") // Asegura que sea un número válido
      .optional(),
  })
  .strict(); // No permite propiedades adicionales

// Notes: Diferencia de coerce y transform
/* 
coerce: Intenta convertir el valor antes de la validación (por ejemplo, convierte una cadena numérica a un número).
transform: Aplica una transformación después de la validación exitosa, sin intentar cambiar el tipo antes de la validación. */

// Importar tipos de los esquemas generados para usarlos en el código
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductIdInput = z.infer<typeof productIdSchema>;
