//backend/src/routes/usuario.routes.js
import express from "express";

import {
  getDocentes,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  toggleActivo,
  resetPassword,
} from "../controllers/usuario.controller.js";

import authMiddleware from "../../../../../middlewares/auth.middleware.js";
import roleMiddleware from "../../../../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin", "superadmin"]));

router.get("/", getDocentes);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);
router.put("/:id/toggle", toggleActivo);
router.put("/:id/password", resetPassword);

export default router;