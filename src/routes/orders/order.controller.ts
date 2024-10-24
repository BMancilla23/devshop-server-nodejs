import { db } from "@db/index.js";
import { ordersTable, orderItemsTable } from "@db/schemas/orders.js";

import {
  CreateOrderWithItemsInput,
  OrderIdInput,
  UpdateOrderInput,
} from "@validations/order.validator.js";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

interface Item {
  price: number;
  productId: number;
  quantity: number;
}

// Crear una nueva orden con items asociados
export async function createOrder(
  req: Request<unknown, CreateOrderWithItemsInput>, // El tipo del request y la validación de entrada
  res: Response
): Promise<void> {
  try {
    // Desestructuramos la orden y los items que llegan en el body
    const { order, items }: CreateOrderWithItemsInput = req.body;
    /*   console.log(data); */

    // Extraemos el userId del objeto de request, en este caso, se asume que está en `req.userId
    const userId = Number(req.userId);

    // Si no hay userId (usuario no autenticado), devolvemos error 401
    if (!userId) {
      res.status(401).json({ message: "Invalid order data" });
      return;
    }

    // Insertamos una nueva orden en la tabla ordersTable
    const [newOrder] = await db
      .insert(ordersTable)
      .values({
        userId: userId,
      })
      .returning(); // Retornamos la orden creada

    /*  console.log(newOrder); */

    // TODO: Validate product ide, and take their actual price from db
    // Creamos los items de la orden, asignando el `orderId` al item para mantener la relación
    const orderItems = items.map((item: Item) => ({
      ...item,
      orderId: newOrder.id, // Asociamos cada item a la nueva orden
    }));

    // Insertamos los items en la tabla de items y retornamos los nuevos items creados
    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    // Respondemos con el código 201 (creado exitosamente), junto con los detalles de la orden y sus items
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      ...newOrder,
      items: newOrderItems,
    });
  } catch (error) {
    /* console.error(error); */
    // Si ocurre algún error, devolvemos un error 500 (error de servidor interno)
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
    return;
  }
}

// If req.role is admin, return all orders
// If req.role is seller, return orders by sellerId
// else, return only orders filtered by req.userId
export async function listOrders(req: Request, res: Response): Promise<void> {
  try {
    // Consultamos todas las órdenes de la base de datos
    const orders = await db.select().from(ordersTable);

    // Respondemos con las órdenes obtenidas
    res.status(200).json({ success: true, orders });
  } catch (error) {
    /* console.error(error); */
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
    return;
  }
}

export async function getOrder(req: Request<OrderIdInput>, res: Response) {
  try {
    // Extraemos el ID de la orden desde los parámetros de la ruta
    const { id }: OrderIdInput = req.params;
    /* console.log(id); */

    // TODO: required to setup the relationship
    /* const result = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, +id),
      with: {
        items: true,
      },
    }); */

    // Consultamos la orden con sus items asociados, haciendo un LEFT JOIN
    const orderWithItems = await db
      // Seleccionamos los datos
      .select()
      // De la tabla de órdenes
      .from(ordersTable)
      // Condición: el `id` de la orden debe coincidir
      .where(eq(ordersTable.id, +id))
      // Unimos los items que pertenezcan a la orden
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

    if (orderWithItems.length === 0) {
      res.status(404).send("Order not found");
      return;
    }

    // Unificamos los datos de la orden y sus items en un solo objeto
    const mergedOrder = {
      ...orderWithItems[0].orders,
      // Array de items de la orden
      items: orderWithItems.map((oi) => oi.order_items),
    };
    // Respondemos con el detalle de la orden
    res.status(200).json({ success: true, mergedOrder });
  } catch (error) {
    /* console.error(error); */
    // En caso de error, devolvemos un error 500
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
    return;
  }
}

export async function updateOrder(
  req: Request<OrderIdInput, UpdateOrderInput>,
  res: Response
) {
  try {
    // Extraemos el `id` de la orden desde los parámetros
    const { id }: OrderIdInput = req.params;

    // Extraemos los datos a actualizar del cuerpo de la solicitud
    const data: UpdateOrderInput = req.body;

    // Actualizamos la orden en la base de datos
    const [updatedOrder] = await db
      // Tabla a actualizar
      .update(ordersTable)
      // Establecemos los nuevos valores
      .set(data)
      // Condición: el `id` debe coincidir
      .where(eq(ordersTable.id, +id))
      // Retornamos la orden actualizada
      .returning();

    // Si no se encontró ninguna orden, devolvemos un error 404
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    // Respondemos con la orden actualizada
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    /* console.error(error); */
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
    return;
  }
}
