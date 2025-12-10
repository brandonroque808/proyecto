import express from "express";
import { registrar, login } from "../controllers/usuariosController.js";

const router = express.Router();

router.post("/register", registrar);
router.post("/login", login);

export default router;
