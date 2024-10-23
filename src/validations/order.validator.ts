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

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export type CreateOrderWithItemsInput = z.infer<
  typeof createOrderWithItemsSchema
>;
