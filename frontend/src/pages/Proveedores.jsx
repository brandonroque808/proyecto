import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Obtener proveedores del backend
  const fetchProveedores = async () => {
    try {
      const res = await api.get("/proveedores");
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al obtener proveedores", error);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Crear o editar proveedor
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
        await api.put(`/proveedores/${editingId}`, {
          nombre,
          email,
          telefono,
          direccion,
        });
      } else {
        await api.post("/proveedores", {
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
      fetchProveedores();
    } catch (error) {
      console.error("Error al guardar proveedor", error);
    }
  };

  // Editar proveedor
  const handleEdit = (proveedor) => {
    setNombre(proveedor.nombre);
    setEmail(proveedor.email);
    setTelefono(proveedor.telefono);
    setDireccion(proveedor.direccion);
    setEditingId(proveedor.id);
  };

  // Eliminar proveedor (lógico)
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este proveedor?")) {
      try {
        await api.delete(`/proveedores/${id}`);
        fetchProveedores();
      } catch (error) {
        console.error("Error al eliminar proveedor", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Proveedores</h2>

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
            {proveedores.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.email}</td>
                <td>{p.telefono}</td>
                <td>{p.direccion}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
