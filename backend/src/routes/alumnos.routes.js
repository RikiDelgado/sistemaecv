//backend/src/routes/alumnos.routes.js
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
      genero,
      direccion,
      tutor_nombre,
      tutor_apellido,
      tutor_telefono,
      alergia_medicamento,
      alergia_medicamento_detalle,
      alergia_alimento,
      alergia_alimento_detalle,
    } = req.body;

    // Validaciones mínimas
    if (!nombre || !apellido || !dni || !fecha_nacimiento) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO alumnos (
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        genero,
        direccion,
        tutor_nombre,
        tutor_apellido,
        tutor_telefono,
        alergia_medicamento,
        alergia_medicamento_detalle,
        alergia_alimento,
        alergia_alimento_detalle
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING *
      `,
      [
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        genero,
        direccion,
        tutor_nombre,
        tutor_apellido,
        tutor_telefono,
        alergia_medicamento,
        alergia_medicamento_detalle,
        alergia_alimento,
        alergia_alimento_detalle,
      ]
    );

    res.status(201).json({
      mensaje: "Alumno inscripto correctamente",
      alumno: result.rows[0],
    });
  } catch (error) {
    // DNI duplicado
    if (error.code === "23505") {
      return res.status(409).json({
        error: "El alumno ya está inscripto (DNI duplicado)",
      });
    }

    console.error(error);
    res.status(500).json({
      error: "Error al inscribir alumno",
    });
  }
});

/**
 * GET /alumnos
 * Lista de alumnos (admin y docente)
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
 * Alumno individual
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
