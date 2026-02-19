//backend/src/routes/usuario.routes.js
import express from "express";
import {
  getDocentes,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  toggleActivo,
} from "../controllers/usuario.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// TODAS protegidas
router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/", getDocentes);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
router.put("/:id/toggle", toggleActivo);

export default router;

