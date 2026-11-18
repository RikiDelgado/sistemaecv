import pool from "../../../../../config/db.js";
import bcrypt from "bcryptjs";

// LISTAR DOCENTES
export const getDocentes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.telefono,
        u.activo,
        u.clase_id,
        u.ultimo_acceso,
        c.nombre AS clase_nombre
      FROM usuarios u
      LEFT JOIN clases c ON u.clase_id = c.id
      WHERE u.rol = 'docente'
        AND u.eliminado = FALSE
      ORDER BY u.nombre ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo docentes"
    });
  }
};

// CREAR DOCENTE
export const createUsuario = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      password,
      clase_id
    } = req.body;

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Completa los datos y usa una contraseña válida de al menos 8 caracteres"
      });
    }

    const hash = await bcrypt.hash(password, 12);

    const result = await pool.query(`
      INSERT INTO usuarios (
        nombre,
        apellido,
        email,
        telefono,
        password,
        rol,
        clase_id,
        activo
      )
      VALUES ($1,$2,$3,$4,$5,'docente',$6,TRUE)
      RETURNING id, nombre, email, rol, activo
    `, [
      nombre.trim(),
      apellido || null,
      email.trim().toLowerCase(),
      telefono || null,
      hash,
      clase_id || null
    ]);

    res.status(201).json({
      message: "Docente creado correctamente",
      usuario: result.rows[0]
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "El correo ya está registrado"
      });
    }

    console.error(error);
    res.status(500).json({
      error: "Error creando docente"
    });
  }
};

// EDITAR DOCENTE
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      email,
      telefono,
      clase_id
    } = req.body;

    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        error: "Nombre y correo obligatorios"
      });
    }

    const result = await pool.query(`
      UPDATE usuarios
      SET nombre = $1,
          email = $2,
          clase_id = $3,
          apellido = COALESCE($4, apellido),
          telefono = COALESCE($5, telefono),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
        AND rol = 'docente'
        AND eliminado = FALSE
      RETURNING id
    `, [
      nombre.trim(),
      email.trim().toLowerCase(),
      clase_id || null,
      apellido ?? null,
      telefono ?? null,
      id
    ]);

    if (!result.rowCount) {
      return res.status(404).json({
        error: "Docente no encontrado"
      });
    }

    res.json({ message: "Docente actualizado" });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "El correo ya está registrado"
      });
    }

    console.error(error);
    res.status(500).json({
      error: "Error actualizando docente"
    });
  }
};

// ELIMINAR DOCENTE LOGICAMENTE
export const deleteUsuario = async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE usuarios
      SET eliminado = TRUE,
          activo = FALSE,
          clase_id = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND rol = 'docente'
        AND eliminado = FALSE
      RETURNING id
    `, [req.params.id]);

    if (!result.rowCount) {
      return res.status(404).json({
        error: "Docente no encontrado"
      });
    }

    res.json({
      message: "Docente eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      error: "Error eliminando docente"
    });
  }
};

// ACTIVAR O DESACTIVAR
export const toggleActivo = async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE usuarios
      SET activo = NOT activo,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND rol = 'docente'
        AND eliminado = FALSE
      RETURNING activo
    `, [req.params.id]);

    if (!result.rowCount) {
      return res.status(404).json({
        error: "Docente no encontrado"
      });
    }

    res.json({
      message: "Estado actualizado",
      activo: result.rows[0].activo
    });
  } catch (error) {
    res.status(500).json({
      error: "Error cambiando estado"
    });
  }
};

// RESTABLECER CONTRASEÑA
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Contraseña inválida"
      });
    }

    const hash = await bcrypt.hash(password, 12);

    const result = await pool.query(`
      UPDATE usuarios
      SET password = $1,
          cambiar_password = TRUE,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
        AND rol = 'docente'
        AND eliminado = FALSE
      RETURNING id
    `, [hash, req.params.id]);

    if (!result.rowCount) {
      return res.status(404).json({
        error: "Docente no encontrado"
      });
    }

    res.json({
      message: "Contraseña restablecida"
    });
  } catch (error) {
    res.status(500).json({
      error: "Error cambiando contraseña"
    });
  }
};