import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Obtener clientes del backend
  const fetchClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Crear o editar cliente
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nombre || !email) {
      alert("Nombre y email son obligatorios");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email inválido");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, {
          nombre,
          email,
          telefono,
          direccion,
        });
      } else {
        await api.post("/clientes", {
          nombre,
          email,
          telefono,
          direccion,
        });
      }
      setNombre("");
      setEmail("");
      setTelefono("");
      setDireccion("");
      setEditingId(null);
      fetchClientes();
    } catch (error) {
      console.error("Error al guardar cliente", error);
    }
  };

  // Editar cliente
  const handleEdit = (cliente) => {
    setNombre(cliente.nombre);
    setEmail(cliente.email);
    setTelefono(cliente.telefono);
    setDireccion(cliente.direccion);
    setEditingId(cliente.id);
  };

  // Eliminar cliente (lógico)
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        fetchClientes();
      } catch (error) {
        console.error("Error al eliminar cliente", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Clientes</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <button type="submit">{editingId ? "Actualizar" : "Agregar"}</button>
        </form>

        <table border="1" cellPadding="10">
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
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
                <td>{c.telefono}</td>
                <td>{c.direccion}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Editar</button>
                  <button onClick={() => handleDelete(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
