import express from "express";
import { generarReporte } from "../controllers/reportesController.js";

const router = express.Router();

// Generar reporte
router.get("/:tipo", generarReporte);

export default router;
