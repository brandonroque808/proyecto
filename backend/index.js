import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoutes from "./src/routes/usuarios.js";
import productRoutes from "./src/routes/productos.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/usuarios", userRoutes);
app.use("/api/productos", productRoutes);

app.listen(process.env.PORT, () =>
    console.log("Servidor corriendo en puerto", process.env.PORT)
);
