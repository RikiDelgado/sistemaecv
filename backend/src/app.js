// backend/src/app.js

import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import pool from "./config/db.js";

// Autenticacion global
import authRoutes from "./modules/auth/routes/auth.routes.js";

// Modulos ECV
import alumnosRoutes from "./modules/iglesia/ministerio-infantil/ecv/routes/alumnos.routes.js";
import clasesRoutes from "./modules/iglesia/ministerio-infantil/ecv/routes/clases.routes.js";
import usuarioRoutes from "./modules/iglesia/ministerio-infantil/ecv/routes/usuario.routes.js";
import asistenciasAdminRoutes from "./modules/iglesia/ministerio-infantil/ecv/routes/asistenciasAdmin.routes.js";

// Middlewares
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://sistemaecv.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("No permitido por CORS"));
    },
    credentials: true,
  })
);

// Limite de intentos de inicio de sesion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Demasiados intentos",
});

app.use("/auth/login", loginLimiter);

// Autenticacion
app.use("/auth", authRoutes);

// Rutas ECV
const ecv = "/ministerio-infantil/ecv";

app.use(`${ecv}/alumnos`, alumnosRoutes);
app.use(`${ecv}/clases`, clasesRoutes);
app.use(`${ecv}/usuarios`, usuarioRoutes);
app.use(`${ecv}/admin/asistencias`, asistenciasAdminRoutes);

// Comprobar conexion
app.get("/", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      mensaje: "Servidor funcionando",
      database: "Conectada",
    });
  } catch (error) {
    console.error("Error de base de datos:", error.message);

    res.status(500).json({
      error: "Error de conexion",
    });
  }
});

// Manejo global de errores
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});