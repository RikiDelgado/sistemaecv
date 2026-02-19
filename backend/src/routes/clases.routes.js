//backend/src/routes/clases.routes.js
import express from "express";
import {
  crearClase,
  listarClases,
  editarClase,
  eliminarClase,
  verMiClase,
} from "../controllers/clases.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * ============================
 * ADMIN ROUTES
 * ============================
 */
router.post("/", authMiddleware, roleMiddleware(["admin"]), crearClase);
router.get("/", authMiddleware, roleMiddleware(["admin"]), listarClases);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), editarClase);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), eliminarClase);

/**
 * ============================
 * DOCENTE ROUTES
 * ============================
 */
router.get(
  "/docente/mi-clase",
  authMiddleware,
  roleMiddleware(["docente"]),
  verMiClase
);

export default router;
