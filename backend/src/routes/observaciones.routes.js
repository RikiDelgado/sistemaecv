//backend/src/routes/observaciones.routes.js
import express from "express";
import pool from "../db.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";


const router = express.Router();

/**
 * POST /observaciones
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "DOCENTE"]),
  async (req, res) => {
    try {
      const { alumno_id, texto } = req.body;

      const result = await pool.query(
        `INSERT INTO observaciones (alumno_id, texto, usuario_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [alumno_id, texto, req.user.id]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al crear observación" });
    }
  }
);

/**
 * GET /observaciones/alumno/:id
 */
router.get(
  "/alumno/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "DOCENTE"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM observaciones WHERE alumno_id = $1`,
        [req.params.id]
      );

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener observaciones" });
    }
  }
);

export default router;
