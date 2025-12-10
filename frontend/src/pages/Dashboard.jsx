import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productos: 0,
    clientes: 0,
    proveedores: 0,
    comprasHoy: 0,
    ventasHoy: 0,
    stockBajo: 0,
    productosSinStock: 0,
    totalInventario: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    ventas: [],
    compras: []
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        productosRes,
        clientesRes,
        proveedoresRes,
        comprasRes,
        ventasRes
      ] = await Promise.all([
        api.get("/productos"),
        api.get("/clientes"),
        api.get("/proveedores"),
        api.get("/compras"),
        api.get("/ventas")
      ]);

      const productos = productosRes.data;
      const compras = comprasRes.data;
      const ventas = ventasRes.data;

      const stockBajo = productos.filter(p => p.stock > 0 && p.stock < 10).length;
      const sinStock = productos.filter(p => p.stock === 0).length;
      const totalInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

      const hoy = new Date().toDateString();
      const comprasHoy = compras.filter(c =>
        new Date(c.fecha).toDateString() === hoy
      ).length;
      const ventasHoy = ventas.filter(v =>
        new Date(v.fecha).toDateString() === hoy
      ).length;

      setStats({
        productos: productos.length,
        clientes: clientesRes.data.length,
        proveedores: proveedoresRes.data.length,
        comprasHoy,
        ventasHoy,
        stockBajo,
        productosSinStock: sinStock,
        totalInventario
      });

      setRecentActivity({
        ventas: ventas.slice(0, 5),
        compras: compras.slice(0, 5)
      });

    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="spinner"></div>
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            Cargando datos del dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Resumen general del sistema de inventario
          </p>
        </div>

        {/* Alertas */}
        {stats.productosSinStock > 0 && (
          <div className="alert alert-danger">
            ⚠️ <strong>Atención:</strong> Tienes {stats.productosSinStock} producto(s) sin stock
          </div>
        )}
        {stats.stockBajo > 0 && (
          <div className="alert alert-warning">
            📉 <strong>Aviso:</strong> {stats.stockBajo} producto(s) con stock bajo (menos de 10 unidades)
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-label">Total Productos</div>
            <div className="stat-value">{stats.productos}</div>
            <div className="stat-icon">📦</div>
          </div>

          <div className="stat-card success">
            <div className="stat-label">Total Clientes</div>
            <div className="stat-value">{stats.clientes}</div>
            <div className="stat-icon">👥</div>
          </div>

          <div className="stat-card warning">
            <div className="stat-label">Total Proveedores</div>
            <div className="stat-value">{stats.proveedores}</div>
            <div className="stat-icon">🏢</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-label">Productos Sin Stock</div>
            <div className="stat-value">{stats.productosSinStock}</div>
            <div className="stat-icon">⚠️</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-label">Compras Hoy</div>
            <div className="stat-value">{stats.comprasHoy}</div>
            <div className="stat-icon">🛒</div>
          </div>

          <div className="stat-card success">
            <div className="stat-label">Ventas Hoy</div>
            <div className="stat-value">{stats.ventasHoy}</div>
            <div className="stat-icon">💰</div>
          </div>

          <div className="stat-card warning">
            <div className="stat-label">Stock Bajo</div>
            <div className="stat-value">{stats.stockBajo}</div>
            <div className="stat-icon">📉</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Valor Total Inventario</div>
            <div className="stat-value">
              ${stats.totalInventario.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
            </div>
            <div className="stat-icon">💵</div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Ventas Recientes */}
          <div className="card">
            <h2 className="card-header">📊 Ventas Recientes</h2>
            {recentActivity.ventas.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.ventas.map((v) => (
                      <tr key={v.id}>
                        <td>{v.clienteNombre}</td>
                        <td>{v.productoNombre}</td>
                        <td>{v.cantidad}</td>
                        <td>
                          {new Date(v.fecha).toLocaleDateString('es-BO', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">💰</div>
                <p className="empty-state-text">No hay ventas recientes</p>
              </div>
            )}
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/ventas')}
            >
              Ver todas las ventas →
            </button>
          </div>

          {/* Compras Recientes */}
          <div className="card">
            <h2 className="card-header">🛒 Compras Recientes</h2>
            {recentActivity.compras.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.compras.map((c) => (
                      <tr key={c.id}>
                        <td>{c.proveedorNombre}</td>
                        <td>{c.productoNombre}</td>
                        <td>{c.cantidad}</td>
                        <td>
                          {new Date(c.fecha).toLocaleDateString('es-BO', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🛒</div>
                <p className="empty-state-text">No hay compras recientes</p>
              </div>
            )}
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/compras')}
            >
              Ver todas las compras →
            </button>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h2 className="card-header">⚡ Accesos Rápidos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/productos')}>
              ➕ Nuevo Producto
            </button>
            <button className="btn btn-success" onClick={() => navigate('/ventas')}>
              💰 Registrar Venta
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/compras')}>
              🛒 Registrar Compra
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/reportes')}>
              📊 Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}