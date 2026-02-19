//backend/src/controllers/alumnos.controller.js
import pool from "../db.js";

/**
 * DOCENTE: listar alumnos de SU clase
 */
export async function listarMisAlumnos(req, res) {
  const { clase_id } = req.user;

  if (!clase_id) {
    return res.status(403).json({
      error: "No tenés clase asignada",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        nombre,
        apellido,
        dni,
        talle_remera
      FROM alumnos
      WHERE clase_id = $1
      ORDER BY apellido, nombre
      `,
      [clase_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener alumnos del docente",
    });
  }
}
