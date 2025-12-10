import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Importar rutas
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/productos.js";
import clientesRoutes from "./src/routes/clientes.js";
import proveedoresRoutes from "./src/routes/proveedores.js";
import comprasRoutes from "./src/routes/compras.js";
import ventasRoutes from "./src/routes/ventas.js";
import reportesRoutes from "./src/routes/reportes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/compras", comprasRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/reportes", reportesRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "API funcionando correctamente" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});