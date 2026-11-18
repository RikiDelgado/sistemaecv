//backend/src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export default async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Token no proporcionado"
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(
      header.split(" ")[1],
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );
  } catch {
    return res.status(401).json({
      error: "Token inválido o expirado"
    });
  }

  try {
    const result = await pool.query(`
      SELECT id, nombre, rol, activo,
             eliminado, clase_id
      FROM usuarios
      WHERE id = $1
    `, [decoded.id]);

    const usuario = result.rows[0];

    if (!usuario || !usuario.activo || usuario.eliminado) {
      return res.status(403).json({
        error: "Usuario sin acceso"
      });
    }

    req.user = usuario;
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error verificando sesión"
    });
  }
}