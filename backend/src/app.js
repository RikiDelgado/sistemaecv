// backend/src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

import pool from "./db.js";
import alumnosRoutes from "./routes/alumnos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import asistenciasAdminRoutes from "./routes/asistenciasAdmin.routes.js";
import clasesRoutes from "./routes/clases.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARES
===================== */

// JSON
app.use(express.json());

/* =====================
   CORS SEGURO
===================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://sistemaecv.vercel.app",
  "https://sistemaecv-git-main-ricardos-projects-853ddb17.vercel.app",
  "https://sistemaecv-8e0s36xqo-ricardos-proyectos-853ddb17.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

/* =====================
   RATE LIMIT LOGIN
===================== */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Demasiados intentos, intentá más tarde",
});

app.use("/auth/login", loginLimiter);

/* =====================
   RUTAS
===================== */

app.use("/auth", authRoutes);
app.use("/alumnos", alumnosRoutes);
app.use("/clases", clasesRoutes);
app.use("/admin/asistencias", asistenciasAdminRoutes);
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
    res.status(500).json({
      error: "Error de conexión a la base de datos",
    });
  }
});

/* =====================
   ERROR HANDLER GLOBAL
===================== */

app.use(errorMiddleware);

/* =====================
   SERVER
===================== */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
