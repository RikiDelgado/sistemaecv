//backend/src/routes/clases.routes.js
import express from "express";
import {
  crearClase,
  listarClases,
  asignarDocenteAClase,
  verMiClase
} from "../controllers/clases.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * Crear clase (admin)
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  crearClase
);

/**
 * Listar clases (admin)
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  listarClases
);

/**
 * Asignar docente a clase (admin)
 */
router.put(
  "/:claseId/asignar-docente",
  authMiddleware,
  roleMiddleware(["admin"]),
  asignarDocenteAClase
);

/**
 * DOCENTE → ver su clase
 */
router.get(
  "/docente/mi-clase",
  authMiddleware,
  roleMiddleware(["docente"]),
  verMiClase
);

export default router;
