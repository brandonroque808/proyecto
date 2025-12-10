import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Compras() {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [proveedorId, setProveedorId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");

  // Obtener proveedores, productos y historial de compras
  const fetchData = async () => {
    try {
      const provRes = await api.get("/proveedores");
      setProveedores(provRes.data);

      const prodRes = await api.get("/productos");
      setProductos(prodRes.data);

      const histRes = await api.get("/compras");
      setHistorial(histRes.data);
    } catch (error) {
      console.error("Error al obtener datos", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Registrar compra
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proveedorId || !productoId || !cantidad) {
      alert("Selecciona proveedor, producto y cantidad");
      return;
    }

    try {
      await api.post("/compras", {
        proveedorId,
        productoId,
        cantidad: parseInt(cantidad),
      });

      // Limpiar campos
      setProveedorId("");
      setProductoId("");
      setCantidad("");
      fetchData();
    } catch (error) {
      console.error("Error al registrar compra", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Registrar Compra</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <select
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
            required
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <select
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            required
          >
            <option value="">Seleccionar producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} (Stock: {p.stock})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            min="1"
          />

          <button type="submit">Registrar Compra</button>
        </form>

        <h3>Historial de Compras</h3>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((c) => (
              <tr key={c.id}>
                <td>{c.proveedorNombre}</td>
                <td>{c.productoNombre}</td>
                <td>{c.cantidad}</td>
                <td>{new Date(c.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
