import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    const filtered = proveedores.filter(p =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.telefono?.includes(searchTerm)
    );
    setFilteredProveedores(filtered);
  }, [searchTerm, proveedores]);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const res = await api.get("/proveedores");
      setProveedores(res.data);
      setFilteredProveedores(res.data);
    } catch (error) {
      console.error("Error al obtener proveedores", error);
      setError("Error al cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNombre("");
    setEmail("");
    setTelefono("");
    setDireccion("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombre || !email) {
      setError("Nombre y email son obligatorios");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/proveedores/${editingId}`, {
          nombre,
          email,
          telefono,
          direccion,
        });
        setSuccess("Proveedor actualizado exitosamente");
      } else {
        await api.post("/proveedores", {
          nombre,
          email,
          telefono,
          direccion,
        });
        setSuccess("Proveedor creado exitosamente");
      }
      resetForm();
      fetchProveedores();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error al guardar proveedor", error);
      setError(error.response?.data?.error || "Error al guardar el proveedor");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (proveedor) => {
    setNombre(proveedor.nombre);
    setEmail(proveedor.email);
    setTelefono(proveedor.telefono || "");
    setDireccion(proveedor.direccion || "");
    setEditingId(proveedor.id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      setLoading(true);
      await api.delete(`/proveedores/${id}`);
      setSuccess("Proveedor eliminado exitosamente");
      fetchProveedores();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error al eliminar proveedor", error);
      setError("Error al eliminar el proveedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Proveedores</h1>
          <p className="page-subtitle">Administra la información de tus proveedores</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-header" style={{ marginBottom: 0 }}>
              {editingId ? "Editar Proveedor" : "Nuevo Proveedor"}
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
                  <label className="form-label">Nombre de la Empresa *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Distribuidora ABC"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="contacto@proveedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="2-123456"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dirección de oficina o almacén"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : editingId ? "Actualizar Proveedor" : "Crear Proveedor"}
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

        <div className="card">
          <h2 className="card-header">Lista de Proveedores ({filteredProveedores.length})</h2>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <div className="spinner"></div>}

          {!loading && filteredProveedores.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <p className="empty-state-text">
                {searchTerm ? "No se encontraron proveedores" : "No hay proveedores registrados"}
              </p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  Registrar primer proveedor
                </button>
              )}
            </div>
          )}

          {!loading && filteredProveedores.length > 0 && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProveedores.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '500' }}>🏢 {p.nombre}</td>
                      <td>{p.email}</td>
                      <td>{p.telefono || <em style={{ color: '#9ca3af' }}>No registrado</em>}</td>
                      <td>{p.direccion || <em style={{ color: '#9ca3af' }}>No registrada</em>}</td>
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