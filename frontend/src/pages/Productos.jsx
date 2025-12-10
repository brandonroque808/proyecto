import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Obtener productos del backend
  const fetchProductos = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Crear o editar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !stock) {
      alert("Nombre, precio y stock son obligatorios");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/productos/${editingId}`, {
          nombre,
          descripcion,
          precio,
          stock,
        });
      } else {
        await api.post("/productos", {
          nombre,
          descripcion,
          precio,
          stock,
        });
      }
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");
      setEditingId(null);
      fetchProductos();
    } catch (error) {
      console.error("Error al guardar producto", error);
    }
  };

  // Editar producto
  const handleEdit = (producto) => {
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setEditingId(producto.id);
  };

  // Eliminar producto (lógico)
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        fetchProductos();
      } catch (error) {
        console.error("Error al eliminar producto", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Productos</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <button type="submit">{editingId ? "Actualizar" : "Agregar"}</button>
        </form>

        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>{p.precio}</td>
                <td>{p.stock}</td>
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
