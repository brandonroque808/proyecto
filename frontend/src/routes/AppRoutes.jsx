import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Productos from "../pages/Productos";
import Clientes from "../pages/Clientes";
import Proveedores from "../pages/Proveedores";
import Compras from "../pages/Compras";
import Ventas from "../pages/Ventas";
import Reportes from "../pages/Reportes";

// Simulación de autenticación
const isAuthenticated = () => !!localStorage.getItem("token");

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/productos"
          element={isAuthenticated() ? <Productos /> : <Navigate to="/" />}
        />
        <Route
          path="/clientes"
          element={isAuthenticated() ? <Clientes /> : <Navigate to="/" />}
        />
        <Route
          path="/proveedores"
          element={isAuthenticated() ? <Proveedores /> : <Navigate to="/" />}
        />
        <Route
          path="/compras"
          element={isAuthenticated() ? <Compras /> : <Navigate to="/" />}
        />
        <Route
          path="/ventas"
          element={isAuthenticated() ? <Ventas /> : <Navigate to="/" />}
        />
        <Route
          path="/reportes"
          element={isAuthenticated() ? <Reportes /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
