import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Ventas() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");

  // Obtener clientes, productos y historial de ventas
  const fetchData = async () => {
    try {
      const clientRes = await api.get("/clientes");
      setClientes(clientRes.data);

      const prodRes = await api.get("/productos");
      setProductos(prodRes.data);

      const histRes = await api.get("/ventas");
      setHistorial(histRes.data);
    } catch (error) {
      console.error("Error al obtener datos", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Registrar venta
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clienteId || !productoId || !cantidad) {
      alert("Selecciona cliente, producto y cantidad");
      return;
    }

    const productoSeleccionado = productos.find(p => p.id === parseInt(productoId));
    if (productoSeleccionado.stock < cantidad) {
      alert("Stock insuficiente");
      return;
    }

    try {
      await api.post("/ventas", {
        clienteId,
        productoId,
        cantidad: parseInt(cantidad),
      });

      // Limpiar campos
      setClienteId("");
      setProductoId("");
      setCantidad("");
      fetchData();
    } catch (error) {
      console.error("Error al registrar venta", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Registrar Venta</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
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

          <button type="submit">Registrar Venta</button>
        </form>

        <h3>Historial de Ventas</h3>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((v) => (
              <tr key={v.id}>
                <td>{v.clienteNombre}</td>
                <td>{v.productoNombre}</td>
                <td>{v.cantidad}</td>
                <td>{new Date(v.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
