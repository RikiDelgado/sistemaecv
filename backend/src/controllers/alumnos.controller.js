//backend/src/controllers/alumnos.controller.js
import pool from "../db.js";

/**
 * DOCENTE: listar alumnos de SU tribu
 */
export async function listarMisAlumnos(req, res) {
  const { tribu_id } = req.user;

  if (!tribu_id) {
    return res.status(403).json({
      error: "No tenés tribu asignada",
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
      WHERE tribu_id = $1
      ORDER BY apellido, nombre
      `,
      [tribu_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener alumnos del docente",
    });
  }
}
