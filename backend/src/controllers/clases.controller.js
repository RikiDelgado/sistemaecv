//backend/src/controllers/clases.controller.js
import pool from "../db.js";

/**
 * ============================
 * CREAR CLASE (ADMIN)
 * ============================
 */
export async function crearClase(req, res) {
  const { nombre, capacidad_maxima, docente_id } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO clases (nombre, capacidad_maxima, docente_id)
      VALUES ($1, COALESCE($2, 30), $3)
      RETURNING *
      `,
      [nombre, capacidad_maxima, docente_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        error: "Ya existe una clase con ese nombre o docente duplicado",
      });
    }

    res.status(500).json({ error: "Error al crear clase" });
  }
}

/**
 * ============================
 * LISTAR CLASES (ADMIN)
 * ============================
 */
export async function listarClases(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.nombre,
        c.capacidad_maxima,
        c.docente_id,
        u.nombre AS docente_nombre,
        u.email AS docente_email
      FROM clases c
      LEFT JOIN usuarios u ON u.id = c.docente_id
      WHERE c.eliminado = false
      ORDER BY c.nombre
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clases" });
  }
}

/**
 * ============================
 * EDITAR CLASE (ADMIN)
 * ============================
 */
export async function editarClase(req, res) {
  const { id } = req.params;
  const { nombre, capacidad_maxima, docente_id } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE clases
      SET nombre = $1,
          capacidad_maxima = $2,
          docente_id = $3
      WHERE id = $4
      RETURNING *
      `,
      [nombre, capacidad_maxima, docente_id || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Clase no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar clase" });
  }
}

/**
 * ============================
 * ELIMINAR CLASE (SOFT DELETE)
 * ============================
 */
export async function eliminarClase(req, res) {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE clases SET eliminado = true WHERE id = $1`,
      [id]
    );

    // Quitar clase a alumnos
    await pool.query(
      `UPDATE alumnos SET clase_id = NULL WHERE clase_id = $1`,
      [id]
    );

    // Quitar clase a docentes
    await pool.query(
      `UPDATE usuarios SET clase_id = NULL WHERE clase_id = $1`,
      [id]
    );

    res.json({ mensaje: "Clase eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar clase" });
  }
}

/**
 * ============================
 * DOCENTE → VER SU CLASE
 * ============================
 * MODELO QUE VOS QUERÉS:
 * usuarios.clase_id → clases.id
 */
export async function verMiClase(req, res) {
  const docente_id = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT c.id, c.nombre, c.capacidad_maxima
      FROM clases c
      JOIN usuarios u ON u.clase_id = c.id
      WHERE u.id = $1
      `,
      [docente_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Docente sin clase asignada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clase" });
  }
}
