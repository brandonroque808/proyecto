import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Compras from "./pages/Compras";
import Ventas from "./pages/Ventas";
import Reportes from "./pages/Reportes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas del sistema */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/reportes" element={<Reportes />} />

        {/* Ruta por defecto */}
        <Route path="*" element={<Login setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
