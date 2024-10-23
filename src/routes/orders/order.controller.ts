import { db } from "@db/index.js";
import { schema } from "@db/schemas/index";
import { orderItemsTable, ordersTable } from "@db/schemas/orders";

import {
  CreateOrderInput,
  CreateOrderWithItemsInput,
} from "@validations/order.validator.js";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

interface Item {
  price: number;
  productId: number;
  quantity: number;
}

export async function createOrder(
  req: Request<unknown, CreateOrderWithItemsInput>,
  res: Response
): Promise<void> {
  try {
    const { order, items }: CreateOrderWithItemsInput = req.body;
    /*   console.log(data); */

    const userId = Number(req.userId);

    if (!userId) {
      res.status(401).json({ message: "Invalid order data" });
      return;
    }

    const [newOrder] = await db
      .insert(ordersTable)
      .values({
        userId: userId,
      })
      .returning();

    /*  console.log(newOrder); */

    // TODO: Validate product ide, and take their actual price from db
    const orderItems = items.map((item: Item) => ({
      ...item,
      orderId: newOrder.id,
    }));

    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      ...newOrder,
      items: newOrderItems,
    });
  } catch (error) {
    /* console.error(error); */
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
    return;
  }
}
