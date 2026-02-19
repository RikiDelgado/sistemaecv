// backend/src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import pool from "./db.js";
import alumnosRoutes from "./routes/alumnos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import asistenciasAdminRoutes from "./routes/asistenciasAdmin.routes.js";
import clasesRoutes from "./routes/clases.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";


dotenv.config();

const app = express();

/* =====================
   MIDDLEWARES
===================== */

// JSON (OBLIGATORIO)
app.use(express.json());

// CORS (Render + Vercel)
app.use(
  cors({
    origin: "*",
  })
);

/* =====================
   RUTAS
===================== */

// Auth
app.use("/auth", authRoutes);

// Alumnos
app.use("/alumnos", alumnosRoutes);

// Clases
app.use("/clases", clasesRoutes);

// Asistencias ADMIN / DOCENTE
app.use("/admin/asistencias", asistenciasAdminRoutes);

// Profesores
app.use("/usuarios", usuarioRoutes);


/* =====================
   RUTA TEST
===================== */
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      mensaje: "Servidor funcionando correctamente",
      horaServidor: result.rows[0],
    });
  } catch (error) {
    console.error("❌ ERROR DB:", error.message);
    res.status(500).json({
      error: "Error de conexión a la base de datos",
      detalle: error.message,
    });
  }
});

/* =====================
   SERVER
===================== */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
