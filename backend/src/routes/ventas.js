import express from "express";
import { listar, crear } from "../controllers/ventasController.js";

const router = express.Router();

router.get("/", listar);
router.post("/", crear);

export default router;