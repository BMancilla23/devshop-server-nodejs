// register controller

import { CreateUserInput, LoginUserInput } from "@validations/user.validator";
import { Request, Response } from "express";
import { db } from "@db/index";
import { usersTable } from "@db/schemas/users";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const registerUser = async (
  req: Request<unknown, CreateUserInput>,
  res: Response
) => {
  try {
    const data: CreateUserInput = req.body;
    /*    console.log("Intento de registro para email:", data.email); */

    // Verificar si el email ya está registrado
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email));

    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await argon2.hash(data.password);

    /*     console.log("Contraseña original:", data.password);
    console.log("Hash generado:", hashedPassword); */

    // Verificar inmediatamente si el hash es correcto
    /*  const verificationTest = await argon2.verify(hashedPassword, data.password);
    console.log("Verificación de hash inmediata:", verificationTest); */

    // Insertar el nuevo usuario
    const [user] = await db
      .insert(usersTable)
      .values({
        ...data,
        password: hashedPassword,
      })
      .returning();

    // Verificar nuevamente después de obtener el usuario
    /* const [newUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email)); */

    /* if (newUser) {
      const finalVerification = await argon2.verify(
        newUser.password,
        data.password
      );
      console.log("Verificación final del hash almacenado:", finalVerification);
    } */

    // Eliminar la contraseña del objeto user antes de devolverlo
    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    /* console.error("Error en registro:", error); */
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// login controller
export const loginUser = async (
  req: Request<unknown, LoginUserInput>,
  res: Response
) => {
  try {
    const { email, password }: LoginUserInput = req.body;
    console.log("Intento de login para email:", email);

    // Buscar usuario por email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    /*  console.log("Usuario encontrado:", user ? "Sí" : "No");
    if (user) {
      console.log("Hash almacenado:", user.password);
      console.log("Contraseña ingresada:", password);
    } */

    if (!user) {
      res
        .status(401)
        .json({
          /* error: "Authentication failed - User not found" */ error:
            "Auhenticated failed",
        });
      return;
    }
    //TODO: Eliminar try catch anidado solo era para comprobación de errores
    try {
      // Verificar contraseña
      const passwordsMatch = await argon2.verify(user.password, password);
      /*  console.log("¿Contraseñas coinciden?:", passwordsMatch); */

      if (!passwordsMatch) {
        res.status(401).json({
          /* error: "Authentication failed - Invalid password" */ error:
            "Authentication failed",
        });
        return;
      }

      // Crear token JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      // Eliminar la contraseña del objeto user antes de devolverlo
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        token,
        user: userWithoutPassword,
      });
    } catch (verifyError) {
      /*   console.error("Error al verificar la contraseña:", verifyError); */
      res.status(401).json({
        error: "Authentication failed - Password verification error",
        details: verifyError,
      });
    }
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};
