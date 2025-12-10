import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
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
    fetchClientes();
  }, []);

  useEffect(() => {
    const filtered = clientes.filter(c =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefono?.includes(searchTerm)
    );
    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clientes");
      setClientes(res.data);
      setFilteredClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes", error);
      setError("Error al cargar los clientes");
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
        await api.put(`/clientes/${editingId}`, {
          nombre,
          email,
          telefono,
          direccion,
        });
        setSuccess("Cliente actualizado exitosamente");
      } else {
        await api.post("/clientes", {
          nombre,
          email,
          telefono,
          direccion,
        });
        setSuccess("Cliente creado exitosamente");
      }
      resetForm();
      fetchClientes();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error al guardar cliente", error);
      setError(error.response?.data?.error || "Error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente) => {
    setNombre(cliente.nombre);
    setEmail(cliente.email);
    setTelefono(cliente.telefono || "");
    setDireccion(cliente.direccion || "");
    setEditingId(cliente.id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      setLoading(true);
      await api.delete(`/clientes/${id}`);
      setSuccess("Cliente eliminado exitosamente");
      fetchClientes();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error al eliminar cliente", error);
      setError("Error al eliminar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Gestión de Clientes</h1>
          <p className="page-subtitle">Administra la información de tus clientes</p>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-header" style={{ marginBottom: 0 }}>
              {editingId ? "Editar Cliente" : "Nuevo Cliente"}
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
                  <label className="form-label">Nombre Completo *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Juan Pérez"
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
                    placeholder="cliente@email.com"
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
                    placeholder="70123456"
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
                    placeholder="Calle, zona, ciudad"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : editingId ? "Actualizar Cliente" : "Crear Cliente"}
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
          <h2 className="card-header">Lista de Clientes ({filteredClientes.length})</h2>

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

          {!loading && filteredClientes.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p className="empty-state-text">
                {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
              </p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  Registrar primer cliente
                </button>
              )}
            </div>
          )}

          {!loading && filteredClientes.length > 0 && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: '500' }}>{c.nombre}</td>
                      <td>{c.email}</td>
                      <td>{c.telefono || <em style={{ color: '#9ca3af' }}>No registrado</em>}</td>
                      <td>{c.direccion || <em style={{ color: '#9ca3af' }}>No registrada</em>}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(c)}
                            disabled={loading}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(c.id)}
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