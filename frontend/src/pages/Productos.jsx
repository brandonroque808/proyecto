import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    const filtered = productos.filter(p =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProductos(filtered);
  }, [searchTerm, productos]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/productos");
      setProductos(res.data);
      setFilteredProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setStock("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombre || !precio || !stock) {
      setError("Nombre, precio y stock son obligatorios");
      return;
    }

    if (parseFloat(precio) <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    if (parseInt(stock) < 0) {
      setError("El stock no puede ser negativo");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/productos/${editingId}`, {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          stock: parseInt(stock),
        });
        setSuccess("Producto actualizado exitosamente");
      } else {
        await api.post("/productos", {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          stock: parseInt(stock),
        });
        setSuccess("Producto creado exitosamente");
      }
      resetForm();
      fetchProductos();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error al guardar producto", error);
      setError(error.response?.data?.error || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio.toString());
    setStock(producto.stock.toString());
    setEditingId(producto.id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      setLoading(true);
      await api.delete(`/productos/${id}`);
      setSuccess("Producto eliminado exitosamente");
      fetchProductos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error al eliminar producto", error);
      setError("Error al eliminar el producto");
    } finally {
      setLoading(false);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="badge badge-danger">Sin Stock</span>;
    if (stock < 10) return <span className="badge badge-warning">Stock Bajo</span>;
    return <span className="badge badge-success">Stock OK</span>;
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Productos</h1>
          <p className="page-subtitle">Administra el inventario de productos</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* Formulario */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-header" style={{ marginBottom: 0 }}>
              {editingId ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Ocultar Formulario" : "Mostrar Formulario"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Precio (Bs) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    step="0.01"
                    min="0"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min="0"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  placeholder="Descripción del producto (opcional)"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                  disabled={loading}
                />
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear Producto"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Búsqueda y Lista */}
        <div className="card">
          <h2 className="card-header">Lista de Productos ({filteredProductos.length})</h2>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <div className="spinner"></div>}

          {!loading && filteredProductos.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <p className="empty-state-text">
                {searchTerm ? "No se encontraron productos" : "No hay productos registrados"}
              </p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  Crear primer producto
                </button>
              )}
            </div>
          )}

          {!loading && filteredProductos.length > 0 && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProductos.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '500' }}>{p.nombre}</td>
                      <td style={{ color: '#6b7280' }}>
                        {p.descripcion || <em>Sin descripción</em>}
                      </td>
                      <td style={{ fontWeight: '500' }}>
                        Bs. {parseFloat(p.precio).toFixed(2)}
                      </td>
                      <td>{p.stock}</td>
                      <td>{getStockBadge(p.stock)}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(p)}
                            disabled={loading}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(p.id)}
                            disabled={loading}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
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