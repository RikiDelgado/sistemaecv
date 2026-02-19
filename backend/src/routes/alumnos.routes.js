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
    console.log("BODY RECIBIDO:", req.body);

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
        alergia_alimento_detalle,
        talle_remera
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
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
    res.status(500).json({
      error: "Error al inscribir alumno",
    });
  }
});

/**
 * GET /alumnos
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

/**
 * PUT /alumnos/:id
 * Actualizar alumno
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
          talle_remera=$14
        WHERE id=$15
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
          id,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "Alumno no encontrado",
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al actualizar alumno",
      });
    }
  }
);

/**
 * DELETE /alumnos/:id
 * Eliminar alumno
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

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "Alumno no encontrado",
        });
      }

      res.json({
        mensaje: "Alumno eliminado correctamente",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al eliminar alumno",
      });
    }
  }
);

export default router;
