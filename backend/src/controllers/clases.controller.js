//backend/src/controllers/clases.controller.js
import pool from "../db.js";

/**
 * ============================
 * CLASES
 * ============================
 */

/**
 * Crear clase
 */
export async function crearClase(req, res) {
  const { nombre, capacidad_maxima } = req.body;

  if (!nombre) {
    return res.status(400).json({
      error: "El nombre de la clase es obligatorio",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO clases (nombre, capacidad_maxima)
       VALUES ($1, COALESCE($2, 20))
       RETURNING *`,
      [nombre, capacidad_maxima]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Ya existe una clase con ese nombre",
      });
    }

    res.status(500).json({
      error: "Error al crear clase",
    });
  }
}

/**
 * Listar clases
 */
export async function listarClases(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.nombre,
        c.capacidad_maxima,
        u.id AS docente_id,
        u.nombre AS docente_nombre,
        u.email AS docente_email
      FROM clases c
      LEFT JOIN usuarios u ON u.id = c.docente_id
      ORDER BY c.nombre
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener clases",
    });
  }
}

/**
 * Asignar docente a clase
 */
export async function asignarDocenteAClase(req, res) {
  const { claseId } = req.params;
  const { docenteId } = req.body;

  if (!docenteId) {
    return res.status(400).json({
      error: "docenteId es obligatorio",
    });
  }

  try {
    const docente = await pool.query(
      `SELECT id FROM usuarios WHERE id = $1 AND rol = 'docente'`,
      [docenteId]
    );

    if (docente.rowCount === 0) {
      return res.status(400).json({
        error: "El usuario no es docente",
      });
    }

    // Quitar clase previa
    await pool.query(
      `UPDATE clases SET docente_id = NULL WHERE docente_id = $1`,
      [docenteId]
    );

    // Asignar docente a nueva clase
    await pool.query(
      `UPDATE clases
       SET docente_id = $1
       WHERE id = $2`,
      [docenteId, claseId]
    );

    // Guardar clase en usuario
    await pool.query(
      `UPDATE usuarios
       SET clase_id = $1
       WHERE id = $2`,
      [claseId, docenteId]
    );

    res.json({ mensaje: "Docente asignado correctamente" });
  } catch (error) {
    res.status(500).json({
      error: "Error al asignar docente",
    });
  }
}

/**
 * ============================
 * ALUMNOS EN CLASES
 * ============================
 */

export async function asignarAlumnoAClase(req, res) {
  const { claseId, alumnoId } = req.params;

  try {
    const clase = await pool.query(
      "SELECT id FROM clases WHERE id = $1",
      [claseId]
    );

    if (clase.rowCount === 0) {
      return res.status(404).json({ error: "Clase no encontrada" });
    }

    const alumno = await pool.query(
      "SELECT id FROM alumnos WHERE id = $1",
      [alumnoId]
    );

    if (alumno.rowCount === 0) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    await pool.query(
      "UPDATE alumnos SET clase_id = $1 WHERE id = $2",
      [claseId, alumnoId]
    );

    res.json({ mensaje: "Alumno asignado a la clase" });
  } catch (error) {
    res.status(500).json({ error: "Error al asignar alumno" });
  }
}

export async function quitarAlumnoDeClase(req, res) {
  const { alumnoId } = req.params;

  try {
    await pool.query(
      "UPDATE alumnos SET clase_id = NULL WHERE id = $1",
      [alumnoId]
    );

    res.json({ mensaje: "Alumno quitado de la clase" });
  } catch (error) {
    res.status(500).json({ error: "Error al quitar alumno" });
  }
}

export async function listarAlumnosDeClase(req, res) {
  const { claseId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM alumnos WHERE clase_id = $1 ORDER BY nombre",
      [claseId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar alumnos" });
  }
}

/**
 * DOCENTE: ver su clase
 */
export async function verMiClase(req, res) {
  const { clase_id } = req.user;

  if (!clase_id) {
    return res.status(404).json({
      error: "No tenés una clase asignada",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        nombre,
        capacidad_maxima
      FROM clases
      WHERE id = $1
      `,
      [clase_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener clase del docente",
    });
  }
}
