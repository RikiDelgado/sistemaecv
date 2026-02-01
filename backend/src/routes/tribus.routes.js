//backend/src/routes/tribus.routes.js
import express from "express";
import {
  crearTribu,
  listarTribus,
  asignarDocente,
  verMiTribu
} from "../controllers/tribus.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * Crear tribu (admin)
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  crearTribu
);

/**
 * Listar tribus (admin)
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  listarTribus
);

/**
 * Asignar docente a tribu (admin)
 */
router.put(
  "/:tribuId/asignar-docente",
  authMiddleware,
  roleMiddleware(["admin"]),
  asignarDocente
);

/**
 * DOCENTE → ver su tribu
 */
router.get(
  "/docente/mi-tribu",
  authMiddleware,
  roleMiddleware(["docente"]),
  verMiTribu
);

export default router;
