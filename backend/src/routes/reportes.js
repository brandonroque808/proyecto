import express from "express";
import { generarReporte } from "../controllers/reportesController.js";

const router = express.Router();


router.get("/:tipo", generarReporte);

export default router;
