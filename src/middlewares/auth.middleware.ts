import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Middleware para verificar el token JWT
function verifyToken(req: Request, res: Response, next: NextFunction): void {
  /* const token = req.header("Authorization"); */

  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  /*  if (!token) {
    res.status(401).json({
      // message: "Token is not provided",
      error: "Access denied",
    });

    return;
  } */

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    /*  console.log(decoded); */
    /* if (typeof decoded !== "object" || !decoded?.userId) {
      res
        .status(401)
        // error: "Invalid token"
        .json({ error: "Acccess denied" });
      return;
    } */
    /*  if (decoded.role !== "admin") {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    } */
    // Asignamos el userId y el rol a la request
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    /* console.error(error); */
    /* res.status(500).json({ message: "Internal server error", error: error }); */
    res.status(401).json({ error: "Access denied" });
    return;
  }
}

// Middleware para verificar roles
function verifyRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: "Access denied. Insufficient permissions.",
      });
      return;
    }
    next();
  };
}

export { verifyToken, verifyRole };
