import { orderItemsTable, ordersTable } from "@db/schemas/orders.js";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const createOrderSchema = createInsertSchema(ordersTable)
  .omit({
    id: true,
    userId: true,
    status: true,
    createdAt: true,
  })
  .strict();

export const createOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  orderId: true,
});

export const createOrderWithItemsSchema = z.object({
  order: createOrderSchema,
  items: z.array(createOrderItemSchema),
});

// Validación del ID de order (para rutas con :id)
export const orderIdSchema = z
  .object({
    id: z
      .string()
      .refine(
        (value) => !isNaN(Number(value)) && Number(value) > 0,
        "ID must be a positive number"
      ),
  })
  .strict();

export const updateOrderSchema = createInsertSchema(ordersTable)
  .omit({
    status: true,
  })
  .partial()
  .strict();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type CreateOrderWithItemsInput = z.infer<
  typeof createOrderWithItemsSchema
>;

export type OrderIdInput = z.infer<typeof orderIdSchema>;

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
