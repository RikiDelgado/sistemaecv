// backend/src/routes/auth.routes.js
import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña obligatorios",
      });
    }

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const usuario = result.rows[0];

    if (usuario.eliminado) {
      return res.status(403).json({
        error: "Usuario eliminado",
      });
    }

    if (usuario.activo === false) {
      return res.status(403).json({
        error: "Usuario desactivado",
      });
    }

    const passwordOk = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordOk) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre,
        clase_id: usuario.clase_id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al iniciar sesión",
    });
  }
});

export default router;
