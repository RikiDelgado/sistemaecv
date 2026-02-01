//backend/src/controllers/tribus.controller.js
import pool from "../db.js";

/**
 * ============================
 * TRIBUS
 * ============================
 */

/**
 * Crear tribu
 */
export async function crearTribu(req, res) {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({
      error: "El nombre de la tribu es obligatorio",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tribus (nombre)
       VALUES ($1)
       RETURNING *`,
      [nombre]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Ya existe una tribu con ese nombre",
      });
    }

    res.status(500).json({
      error: "Error al crear tribu",
    });
  }
}

/**
 * Listar tribus
 */
export async function listarTribus(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.nombre,
        u.id AS docente_id,
        u.nombre AS docente_nombre,
        u.email AS docente_email
      FROM tribus t
      LEFT JOIN usuarios u ON u.id = t.docente_id
      ORDER BY t.nombre
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener tribus",
    });
  }
}

/**
 * Asignar docente a tribu
 * (un docente solo puede tener UNA tribu)
 */
export async function asignarDocente(req, res) {
  const { tribuId } = req.params;
  const { docenteId } = req.body;

  if (!docenteId) {
    return res.status(400).json({
      error: "docenteId es obligatorio",
    });
  }

  try {
    // Verificar que el usuario sea docente
    const docente = await pool.query(
      `SELECT id FROM usuarios WHERE id = $1 AND rol = 'docente'`,
      [docenteId]
    );

    if (docente.rowCount === 0) {
      return res.status(400).json({
        error: "El usuario no es docente",
      });
    }

    // Quitar tribu previa si existía
    await pool.query(
      `UPDATE tribus SET docente_id = NULL WHERE docente_id = $1`,
      [docenteId]
    );

    // Asignar docente a tribu
    await pool.query(
      `UPDATE tribus
       SET docente_id = $1
       WHERE id = $2`,
      [docenteId, tribuId]
    );

    // Guardar tribu en el docente
    await pool.query(
      `UPDATE usuarios
       SET tribu_id = $1
       WHERE id = $2`,
      [tribuId, docenteId]
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
 * ALUMNOS EN TRIBUS
 * ============================
 */

/**
 * Asignar alumno a tribu
 */
export async function asignarAlumnoATribu(req, res) {
  const { tribuId, alumnoId } = req.params;

  try {
    const tribu = await pool.query(
      "SELECT id FROM tribus WHERE id = $1",
      [tribuId]
    );

    if (tribu.rowCount === 0) {
      return res.status(404).json({ error: "Tribu no encontrada" });
    }

    const alumno = await pool.query(
      "SELECT id FROM alumnos WHERE id = $1",
      [alumnoId]
    );

    if (alumno.rowCount === 0) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    await pool.query(
      "UPDATE alumnos SET tribu_id = $1 WHERE id = $2",
      [tribuId, alumnoId]
    );

    res.json({ mensaje: "Alumno asignado a la tribu" });
  } catch (error) {
    res.status(500).json({ error: "Error al asignar alumno" });
  }
}

/**
 * Quitar alumno de tribu
 */
export async function quitarAlumnoDeTribu(req, res) {
  const { alumnoId } = req.params;

  try {
    await pool.query(
      "UPDATE alumnos SET tribu_id = NULL WHERE id = $1",
      [alumnoId]
    );

    res.json({ mensaje: "Alumno quitado de la tribu" });
  } catch (error) {
    res.status(500).json({ error: "Error al quitar alumno" });
  }
}

/**
 * Listar alumnos de una tribu
 */
export async function listarAlumnosDeTribu(req, res) {
  const { tribuId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM alumnos WHERE tribu_id = $1 ORDER BY nombre",
      [tribuId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al listar alumnos" });
  }
}


/**
 * DOCENTE: ver su tribu
 */
export async function verMiTribu(req, res) {
  const { tribu_id } = req.user;

  if (!tribu_id) {
    return res.status(404).json({
      error: "No tenés una tribu asignada",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        t.id,
        t.nombre
      FROM tribus t
      WHERE t.id = $1
      `,
      [tribu_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener tribu del docente",
    });
  }
}
