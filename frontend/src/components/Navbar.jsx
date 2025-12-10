// frontend/src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName") || "Usuario";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        📦 Sistema Inventario
      </Link>

      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
        >
          🏠 Dashboard
        </Link>
        <Link
          to="/productos"
          className={`navbar-link ${isActive('/productos') ? 'active' : ''}`}
        >
          📦 Productos
        </Link>
        <Link
          to="/clientes"
          className={`navbar-link ${isActive('/clientes') ? 'active' : ''}`}
        >
          👥 Clientes
        </Link>
        <Link
          to="/proveedores"
          className={`navbar-link ${isActive('/proveedores') ? 'active' : ''}`}
        >
          🏢 Proveedores
        </Link>
        <Link
          to="/compras"
          className={`navbar-link ${isActive('/compras') ? 'active' : ''}`}
        >
          🛒 Compras
        </Link>
        <Link
          to="/ventas"
          className={`navbar-link ${isActive('/ventas') ? 'active' : ''}`}
        >
          💰 Ventas
        </Link>
        <Link
          to="/reportes"
          className={`navbar-link ${isActive('/reportes') ? 'active' : ''}`}
        >
          📊 Reportes
        </Link>

        <div style={{
          borderLeft: '1px solid rgba(255,255,255,0.3)',
          height: '30px',
          margin: '0 10px'
        }}></div>

        <span style={{ color: 'white', marginRight: '10px' }}>
          👤 {userName}
        </span>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          🚪 Salir
        </button>
      </div>
    </nav>
  );
}