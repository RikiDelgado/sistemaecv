import pool from "../db.js";
import bcrypt from "bcryptjs";

/* =========================
   OBTENER DOCENTES
========================= */
export const getDocentes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.activo, u.clase_id, c.nombre AS clase_nombre
       FROM usuarios u
       LEFT JOIN clases c ON u.clase_id = c.id
       WHERE u.rol = 'docente' AND u.eliminado = FALSE
       ORDER BY u.nombre ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo docentes" });
  }
};

/* =========================
   CREAR DOCENTE
========================= */
export const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, clase_id } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO usuarios (nombre, email, password, rol, clase_id)
       VALUES ($1, $2, $3, 'docente', $4)`,
      [nombre, email, hash, clase_id]
    );

    res.json({ message: "Docente creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando docente" });
  }
};

/* =========================
   EDITAR DOCENTE
========================= */
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, clase_id } = req.body;

    await pool.query(
      `UPDATE usuarios
       SET nombre = $1,
           email = $2,
           clase_id = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [nombre, email, clase_id, id]
    );

    res.json({ message: "Docente actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando docente" });
  }
};

/* =========================
   SOFT DELETE
========================= */
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE usuarios
       SET eliminado = TRUE,
           activo = FALSE
       WHERE id = $1`,
      [id]
    );

    res.json({ message: "Docente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando docente" });
  }
};

/* =========================
   TOGGLE ACTIVO
========================= */
export const toggleActivo = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE usuarios
       SET activo = NOT activo
       WHERE id = $1`,
      [id]
    );

    res.json({ message: "Estado actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cambiando estado" });
  }
};
