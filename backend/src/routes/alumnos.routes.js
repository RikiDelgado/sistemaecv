//backend/src/routes/alumnos.routes.js
import express from "express";
import pool from "../db.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

/**
 * ======================
 * POST /alumnos
 * Inscripción pública
 * ======================
 */
router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("Nombre obligatorio"),
    body("apellido").notEmpty().withMessage("Apellido obligatorio"),
    body("dni").isNumeric().withMessage("DNI debe ser numérico"),
    body("fecha_nacimiento").notEmpty().withMessage("Fecha obligatoria"),
    body("tutor_telefono")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Teléfono inválido"),
  ],
  async (req, res) => {
    try {
      console.log("BODY RECIBIDO:", req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
        talle_remera,
        talla_remera,
      } = req.body;

      const talleFinal = talle_remera ?? talla_remera ?? null;

      const result = await pool.query(
        `
        INSERT INTO alumnos (
          nombre, apellido, dni, fecha_nacimiento, genero, direccion,
          tutor_nombre, tutor_apellido, tutor_telefono,
          alergia_medicamento, alergia_medicamento_detalle,
          alergia_alimento, alergia_alimento_detalle, talle_remera
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
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
          talleFinal,
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

      console.error(error);
      res.status(500).json({ error: "Error al inscribir alumno" });
    }
  }
);

/**
 * ======================
 * GET /alumnos
 * ======================
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
    } catch {
      res.status(500).json({ error: "Error al obtener alumnos" });
    }
  }
);

/**
 * ======================
 * GET /alumnos/:id
 * ======================
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

      if (!result.rows.length) {
        return res.status(404).json({ error: "Alumno no encontrado" });
      }

      res.json(result.rows[0]);
    } catch {
      res.status(500).json({ error: "Error al obtener alumno" });
    }
  }
);

/**
 * ======================
 * PUT /alumnos/:id (EDITAR ALUMNO + CLASE)
 * ======================
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

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
        talle_remera,
        clase_id, // ✅ CLASE
      } = req.body;

      const result = await pool.query(
        `
        UPDATE alumnos SET
          nombre=$1,
          apellido=$2,
          dni=$3,
          fecha_nacimiento=$4,
          genero=$5,
          direccion=$6,
          tutor_nombre=$7,
          tutor_apellido=$8,
          tutor_telefono=$9,
          alergia_medicamento=$10,
          alergia_medicamento_detalle=$11,
          alergia_alimento=$12,
          alergia_alimento_detalle=$13,
          talle_remera=$14,
          clase_id=$15
        WHERE id=$16
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
          talle_remera,
          clase_id,
          id,
        ]
      );

      if (!result.rowCount) {
        return res.status(404).json({ error: "Alumno no encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar alumno" });
    }
  }
);

/**
 * ======================
 * DELETE /alumnos/:id
 * ======================
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        "DELETE FROM alumnos WHERE id = $1 RETURNING *",
        [id]
      );

      if (!result.rowCount) {
        return res.status(404).json({ error: "Alumno no encontrado" });
      }

      res.json({ mensaje: "Alumno eliminado correctamente" });
    } catch {
      res.status(500).json({ error: "Error al eliminar alumno" });
    }
  }
);

export default router;
