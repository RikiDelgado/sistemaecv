//backend/src/routes/asistencias.routes.js
import express from "express";
import pool from "../db.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "docente", "asistente"]),
  async (req, res) => {
    try {
      const { alumno_id, fecha, presente } = req.body;

      await pool.query(
        `INSERT INTO asistencias (alumno_id, fecha, presente)
         VALUES ($1,$2,$3)`,
        [alumno_id, fecha, presente]
      );

      res.json({ mensaje: "Asistencia guardada" });
    } catch (error) {
      res.status(500).json({
        error: "Error al guardar asistencia",
      });
    }
  }
);

export default router;
