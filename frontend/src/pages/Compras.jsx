import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Compras() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [filteredHistorial, setFilteredHistorial] = useState([]);

  const [proveedorId, setProveedorId] = useState("");
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
    const filtered = historial.filter(c =>
      c.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productoNombre.toLowerCase().includes(searchTerm.toLowerCase())
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
      const [provRes, prodRes, histRes] = await Promise.all([
        api.get("/proveedores"),
        api.get("/productos"),
        api.get("/compras")
      ]);

      setProveedores(provRes.data);
      setProductos(prodRes.data);
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

    if (!proveedorId || !productoId || !cantidad) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      setLoading(true);
      await api.post("/compras", {
        proveedorId: parseInt(proveedorId),
        productoId: parseInt(productoId),
        cantidad: cantidadNum,
      });

      const proveedor = proveedores.find(p => p.id === parseInt(proveedorId));
      const producto = productos.find(p => p.id === parseInt(productoId));

      setSuccess(
        `✅ Compra registrada exitosamente! ` +
        `Se agregaron ${cantidadNum} unidades de "${producto?.nombre}" del proveedor "${proveedor?.nombre}"`
      );

      setProveedorId("");
      setProductoId("");
      setCantidad("");
      setSelectedProduct(null);
      fetchData();

      setTimeout(() => setSuccess(""), 5000);
    } catch (error) {
      console.error("Error al registrar compra", error);
      setError(error.response?.data?.error || "Error al registrar la compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Compras</h1>
          <p className="page-subtitle">Registra las compras a proveedores</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {proveedores.length === 0 && !loading && (
          <div className="alert alert-warning">
            ⚠️ No hay proveedores registrados. Debes registrar proveedores primero.
          </div>
        )}

        {productos.length === 0 && !loading && (
          <div className="alert alert-warning">
            ⚠️ No hay productos registrados. Debes crear productos primero.
          </div>
        )}

        <div className="card">
          <h2 className="card-header">🛒 Nueva Compra</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Proveedor *</label>
                <select
                  className="form-control"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  required
                  disabled={loading || proveedores.length === 0}
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} - {p.email}
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
                      {p.nombre} (Stock actual: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cantidad a Comprar *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
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
                  📋 Resumen de Compra
                </h3>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Producto:</strong> {selectedProduct.nombre}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Stock actual:</strong> {selectedProduct.stock} unidad(es)
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Cantidad a agregar:</strong> {cantidad} unidad(es)
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '1.25rem', color: '#059669' }}>
                  <strong>Nuevo stock:</strong> {parseInt(selectedProduct.stock) + parseInt(cantidad || 0)} unidad(es)
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || proveedores.length === 0 || productos.length === 0}
              style={{ width: '100%' }}
            >
              {loading ? "Procesando compra..." : "🛒 Registrar Compra"}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="card-header">📊 Historial de Compras ({filteredHistorial.length})</h2>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por proveedor o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <div className="spinner"></div>}

          {!loading && filteredHistorial.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <p className="empty-state-text">
                {searchTerm ? "No se encontraron compras" : "No hay compras registradas aún"}
              </p>
            </div>
          )}

          {!loading && filteredHistorial.length > 0 && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Proveedor</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistorial.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>{c.proveedorNombre}</td>
                      <td style={{ fontWeight: '500' }}>{c.productoNombre}</td>
                      <td>
                        <span className="badge badge-success">
                          +{c.cantidad} unidad(es)
                        </span>
                      </td>
                      <td>
                        {new Date(c.fecha).toLocaleDateString('es-BO', {
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