import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Ventas() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [filteredHistorial, setFilteredHistorial] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = historial.filter(v =>
      v.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.productoNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistorial(filtered);
  }, [searchTerm, historial]);

  useEffect(() => {
    if (productoId) {
      const prod = productos.find(p => p.id === parseInt(productoId));
      setSelectedProduct(prod);
    } else {
      setSelectedProduct(null);
    }
  }, [productoId, productos]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientRes, prodRes, histRes] = await Promise.all([
        api.get("/clientes"),
        api.get("/productos"),
        api.get("/ventas")
      ]);

      setClientes(clientRes.data);
      setProductos(prodRes.data.filter(p => p.stock > 0));
      setHistorial(histRes.data);
      setFilteredHistorial(histRes.data);
    } catch (error) {
      console.error("Error al obtener datos", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!clienteId || !productoId || !cantidad) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    const producto = productos.find(p => p.id === parseInt(productoId));
    if (!producto) {
      setError("Producto no encontrado");
      return;
    }

    if (producto.stock < cantidadNum) {
      setError(`Stock insuficiente. Disponible: ${producto.stock} unidades`);
      return;
    }

    try {
      setLoading(true);
      await api.post("/ventas", {
        clienteId: parseInt(clienteId),
        productoId: parseInt(productoId),
        cantidad: cantidadNum,
      });

      setSuccess(`✅ Venta registrada exitosamente! Total: Bs. ${(producto.precio * cantidadNum).toFixed(2)}`);
      setClienteId("");
      setProductoId("");
      setCantidad("");
      setSelectedProduct(null);
      fetchData();

      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Error al registrar venta", error);
      setError(error.response?.data?.error || "Error al registrar la venta");
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    if (selectedProduct && cantidad) {
      const cantidadNum = parseInt(cantidad) || 0;
      return (selectedProduct.precio * cantidadNum).toFixed(2);
    }
    return "0.00";
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Ventas</h1>
          <p className="page-subtitle">Registra las ventas a tus clientes</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {productos.length === 0 && !loading && (
          <div className="alert alert-warning">
            ⚠️ No hay productos con stock disponible para vender
          </div>
        )}

        <div className="card">
          <h2 className="card-header">💰 Nueva Venta</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cliente *</label>
                <select
                  className="form-control"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} - {c.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Producto *</label>
                <select
                  className="form-control"
                  value={productoId}
                  onChange={(e) => setProductoId(e.target.value)}
                  required
                  disabled={loading || productos.length === 0}
                >
                  <option value="">Seleccionar producto...</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} - Stock: {p.stock} - Bs. {parseFloat(p.precio).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cantidad *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
                  max={selectedProduct?.stock || 1}
                  required
                  disabled={loading || !productoId}
                />
              </div>
            </div>

            {selectedProduct && cantidad && (
              <div style={{
                padding: '1rem',
                background: '#f3f4f6',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  📋 Resumen de Venta
                </h3>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Producto:</strong> {selectedProduct.nombre}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Precio unitario:</strong> Bs. {parseFloat(selectedProduct.precio).toFixed(2)}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Cantidad:</strong> {cantidad} unidad(es)
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '1.25rem', color: '#059669' }}>
                  <strong>TOTAL: Bs. {calcularTotal()}</strong>
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || productos.length === 0}
              style={{ width: '100%' }}
            >
              {loading ? "Procesando venta..." : "💰 Registrar Venta"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-header">📊 Historial de Ventas ({filteredHistorial.length})</h2>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por cliente o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <div className="spinner"></div>}

          {!loading && filteredHistorial.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">💰</div>
              <p className="empty-state-text">
                {searchTerm ? "No se encontraron ventas" : "No hay ventas registradas aún"}
              </p>
            </div>
          )}

          {!loading && filteredHistorial.length > 0 && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistorial.map((v) => (
                    <tr key={v.id}>
                      <td>#{v.id}</td>
                      <td>{v.clienteNombre}</td>
                      <td style={{ fontWeight: '500' }}>{v.productoNombre}</td>
                      <td>
                        <span className="badge badge-success">
                          {v.cantidad} unidad(es)
                        </span>
                      </td>
                      <td>
                        {new Date(v.fecha).toLocaleDateString('es-BO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}