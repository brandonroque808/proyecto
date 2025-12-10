import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Reportes() {
  const tipos = ["inventario", "clientes", "proveedores", "compras", "ventas"];

  const descargarPDF = async (tipo) => {
    try {
      const res = await api.get(`/reportes/${tipo}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tipo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar PDF", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Reportes PDF</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
          {tipos.map((tipo) => (
            <button key={tipo} onClick={() => descargarPDF(tipo)}>
              Descargar {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
