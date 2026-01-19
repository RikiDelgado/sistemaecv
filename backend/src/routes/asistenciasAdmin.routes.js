//backend/src/routes/asistenciasAdmin.routes.js
import express from "express";
import pool from "../db.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * POST /admin/asistencias/dias
 * Crear un día de asistencia
 */
router.post(
  "/dias",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const { titulo, fecha } = req.body;

      if (!titulo || !fecha) {
        return res.status(400).json({
          error: "Título y fecha son obligatorios",
        });
      }

      const diaResult = await pool.query(
        `INSERT INTO dias_asistencia (titulo, fecha)
         VALUES ($1, $2)
         RETURNING *`,
        [titulo, fecha]
      );

      const dia = diaResult.rows[0];

      // Copiar todos los alumnos como AUSENTE
      await pool.query(
        `
        INSERT INTO asistencias_detalle (dia_id, alumno_id, estado)
        SELECT $1, id, 'ausente'
        FROM alumnos
        `,
        [dia.id]
      );

      res.status(201).json(dia);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al crear día de asistencia",
      });
    }
  }
);

/**
 * GET /admin/asistencias/dias
 * Listar días de asistencia
 */
router.get(
  "/dias",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM dias_asistencia ORDER BY fecha DESC`
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener días de asistencia",
      });
    }
  }
);

/**
 * DELETE /admin/asistencias/dias/:id
 */
router.delete(
  "/dias/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      await pool.query(
        `DELETE FROM dias_asistencia WHERE id = $1`,
        [req.params.id]
      );
      res.json({ mensaje: "Día eliminado" });
    } catch (error) {
      res.status(500).json({
        error: "Error al eliminar día",
      });
    }
  }
);

/**
 * GET /admin/asistencias/dias/:id
 * Obtener asistencia de un día (con nombres)
 */
router.get(
  "/dias/:id",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          ad.id,
          ad.estado,
          a.id AS alumno_id,
          a.nombre,
          a.apellido
        FROM asistencias_detalle ad
        JOIN alumnos a ON a.id = ad.alumno_id
        WHERE ad.dia_id = $1
        ORDER BY a.apellido, a.nombre
        `,
        [req.params.id]
      );

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener asistencias",
      });
    }
  }
);

/**
 * PUT /admin/asistencias/:id
 * Cambiar estado (presente / ausente / tarde)
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const { estado } = req.body;

      if (!["presente", "ausente", "tarde"].includes(estado)) {
        return res.status(400).json({
          error: "Estado inválido",
        });
      }

      await pool.query(
        `UPDATE asistencias_detalle SET estado = $1 WHERE id = $2`,
        [estado, req.params.id]
      );

      res.json({ mensaje: "Estado actualizado" });
    } catch (error) {
      res.status(500).json({
        error: "Error al actualizar asistencia",
      });
    }
  }
);

export default router;
