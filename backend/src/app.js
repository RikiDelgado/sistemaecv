// backend/src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js";

import alumnosRoutes from "./routes/alumnos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import asistenciasRoutes from "./routes/asistencias.routes.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES BÁSICOS
====================== */

// Permitir requests desde el frontend
app.use(cors());

// Permitir recibir JSON (POST, PUT, etc.)
app.use(express.json());

// Permitir formularios (por si acaso)
app.use(express.urlencoded({ extended: true }));

/* ======================
   RUTAS
====================== */

app.use("/alumnos", alumnosRoutes);
app.use("/auth", authRoutes);
app.use("/asistencias", asistenciasRoutes);

/* ======================
   RUTA DE PRUEBA
====================== */

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

/* ======================
   SERVIDOR
====================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
