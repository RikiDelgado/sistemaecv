//backend/src/routes/asistenciasAdmin.routes.js
import express from "express";
import pool from "../db.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/* =====================================================
   CREAR DÍA POR CLASE
===================================================== */
router.post(
  "/dias",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const { titulo, fecha, clase_id } = req.body;

      if (!fecha || !clase_id) {
        return res.status(400).json({
          error: "Fecha y clase_id son obligatorios",
        });
      }

      const profesor_id = req.user.id;

      const diaResult = await pool.query(
        `INSERT INTO dias_asistencia (titulo, fecha, clase_id, profesor_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [titulo || "Día de asistencia", fecha, clase_id, profesor_id]
      );

      const dia = diaResult.rows[0];

      // Copiar SOLO alumnos de esa clase
      await pool.query(
        `
        INSERT INTO asistencias_detalle (dia_id, alumno_id, estado)
        SELECT $1, id, 'ausente'
        FROM alumnos
        WHERE clase_id = $2
        `,
        [dia.id, clase_id]
      );

      res.status(201).json(dia);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al crear día",
      });
    }
  }
);

/* =====================================================
   LISTAR DÍAS CON MÉTRICAS
===================================================== */
router.get(
  "/dias",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          d.*,
          c.nombre AS clase_nombre,
          COUNT(CASE WHEN ad.estado = 'presente' THEN 1 END) AS presentes,
          COUNT(CASE WHEN ad.estado = 'tarde' THEN 1 END) AS tardes,
          COUNT(CASE WHEN ad.estado = 'ausente' THEN 1 END) AS ausentes
        FROM dias_asistencia d
        LEFT JOIN asistencias_detalle ad ON ad.dia_id = d.id
        LEFT JOIN clases c ON c.id = d.clase_id
        GROUP BY d.id, c.nombre
        ORDER BY d.fecha DESC
      `);

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener días",
      });
    }
  }
);

/* =====================================================
   OBTENER DETALLE DE UN DÍA
===================================================== */
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

/* =====================================================
   TOMAR / EDITAR ASISTENCIA COMPLETA
===================================================== */
router.post(
  "/tomar",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const { dia_id, asistencias } = req.body;

      for (const item of asistencias) {
        await pool.query(
          `UPDATE asistencias_detalle
           SET estado = $1
           WHERE id = $2`,
          [item.estado, item.id]
        );
      }

      res.json({ mensaje: "Asistencia guardada correctamente" });
    } catch (error) {
      res.status(500).json({
        error: "Error al guardar asistencia",
      });
    }
  }
);

/* =====================================================
   ELIMINAR DÍA
===================================================== */
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

/* =====================================================
   BUSCAR ALUMNO
===================================================== */
router.get(
  "/buscar-alumno",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const { q } = req.query;

      const result = await pool.query(
        `
        SELECT 
          a.id,
          a.nombre,
          a.apellido,
          COUNT(CASE WHEN ad.estado = 'presente' THEN 1 END) AS presentes,
          COUNT(CASE WHEN ad.estado = 'tarde' THEN 1 END) AS tardes,
          COUNT(CASE WHEN ad.estado = 'ausente' THEN 1 END) AS ausentes
        FROM alumnos a
        LEFT JOIN asistencias_detalle ad ON ad.alumno_id = a.id
        WHERE LOWER(a.nombre) LIKE LOWER($1)
           OR LOWER(a.apellido) LIKE LOWER($1)
        GROUP BY a.id
        LIMIT 10
        `,
        [`%${q}%`]
      );

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Error al buscar alumno",
      });
    }
  }
);

/* =====================================================
   HISTORIAL DE UN ALUMNO
===================================================== */
router.get(
  "/alumno/:id",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          d.fecha,
          c.nombre AS clase,
          ad.estado
        FROM asistencias_detalle ad
        JOIN dias_asistencia d ON d.id = ad.dia_id
        JOIN clases c ON c.id = d.clase_id
        WHERE ad.alumno_id = $1
        ORDER BY d.fecha DESC
        `,
        [req.params.id]
      );

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener historial",
      });
    }
  }
);

export default router;
