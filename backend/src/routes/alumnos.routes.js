import express from "express";
import pool from "../db.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * POST /alumnos
 * Inscripción pública (landing)
 */
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      fecha_nacimiento,
      tutor_nombre,
      tutor_telefono,
    } = req.body;

    if (!nombre || !apellido || !dni || !fecha_nacimiento) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
      });
    }

    const result = await pool.query(
      `INSERT INTO alumnos
      (nombre, apellido, dni, fecha_nacimiento, tutor_nombre, tutor_telefono)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        tutor_nombre,
        tutor_telefono,
      ]
    );

    res.status(201).json({
      mensaje: "Alumno inscripto correctamente",
      alumno: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "El alumno ya está inscripto (DNI duplicado)",
      });
    }

    res.status(500).json({
      error: "Error al inscribir alumno",
    });
  }
});

/**
 * GET /alumnos
 * Lista de alumnos (solo admin y docente)
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM alumnos ORDER BY apellido, nombre"
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener alumnos",
      });
    }
  }
);

/**
 * GET /alumnos/:id
 * Ver alumno individual (admin y docente)
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "SELECT * FROM alumnos WHERE id = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Alumno no encontrado",
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener alumno",
      });
    }
  }
);

export default router;
