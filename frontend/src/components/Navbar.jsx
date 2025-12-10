import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <Link to="/dashboard" style={{ margin: "0 10px", color: "#fff" }}>Dashboard</Link>
      <Link to="/productos" style={{ margin: "0 10px", color: "#fff" }}>Productos</Link>
      <Link to="/clientes" style={{ margin: "0 10px", color: "#fff" }}>Clientes</Link>
      <Link to="/proveedores" style={{ margin: "0 10px", color: "#fff" }}>Proveedores</Link>
      <Link to="/compras" style={{ margin: "0 10px", color: "#fff" }}>Compras</Link>
      <Link to="/ventas" style={{ margin: "0 10px", color: "#fff" }}>Ventas</Link>
      <Link to="/reportes" style={{ margin: "0 10px", color: "#fff" }}>Reportes</Link>
      <button onClick={handleLogout} style={{ marginLeft: "20px" }}>Logout</button>
    </nav>
  );
}
