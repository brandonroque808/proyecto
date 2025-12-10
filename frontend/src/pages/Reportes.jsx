import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Reportes() {
  const [loading, setLoading] = useState(false);
  const [downloadingType, setDownloadingType] = useState(null);

  const reportes = [
    {
      tipo: "inventario",
      nombre: "Inventario de Productos",
      descripcion: "Lista completa de productos con precios y stock",
      icon: "📦",
      color: "#3b82f6"
    },
    {
      tipo: "clientes",
      nombre: "Listado de Clientes",
      descripcion: "Información de contacto de todos los clientes",
      icon: "👥",
      color: "#10b981"
    },
    {
      tipo: "proveedores",
      nombre: "Listado de Proveedores",
      descripcion: "Información de contacto de todos los proveedores",
      icon: "🏢",
      color: "#f59e0b"
    },
    {
      tipo: "compras",
      nombre: "Historial de Compras",
      descripcion: "Registro detallado de todas las compras realizadas",
      icon: "🛒",
      color: "#8b5cf6"
    },
    {
      tipo: "ventas",
      nombre: "Historial de Ventas",
      descripcion: "Registro detallado de todas las ventas realizadas",
      icon: "💰",
      color: "#ef4444"
    }
  ];

  const descargarPDF = async (tipo) => {
    setDownloadingType(tipo);
    setLoading(true);

    try {
      const res = await api.get(`/reportes/${tipo}`, {
        responseType: "blob",
        timeout: 30000
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_${tipo}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Mostrar mensaje de exito
      const successMsg = document.createElement("div");
      successMsg.className = "alert alert-success";
      successMsg.innerHTML = `✅ Reporte de ${tipo} descargado exitosamente`;
      successMsg.style.position = "fixed";
      successMsg.style.top = "20px";
      successMsg.style.right = "20px";
      successMsg.style.zIndex = "9999";
      document.body.appendChild(successMsg);

      setTimeout(() => successMsg.remove(), 3000);

    } catch (error) {
      console.error("Error al descargar PDF", error);

      const errorMsg = document.createElement("div");
      errorMsg.className = "alert alert-danger";
      errorMsg.innerHTML = `⚠️ Error al descargar el reporte: ${error.message}`;
      errorMsg.style.position = "fixed";
      errorMsg.style.top = "20px";
      errorMsg.style.right = "20px";
      errorMsg.style.zIndex = "9999";
      document.body.appendChild(errorMsg);

      setTimeout(() => errorMsg.remove(), 5000);
    } finally {
      setLoading(false);
      setDownloadingType(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Reportes PDF</h1>
          <p className="page-subtitle">
            Descarga reportes detallados de tu sistema de inventario
          </p>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-header">ℹ️ Información</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Los reportes se generan en formato PDF y se descargan automáticamente.
            Incluyen toda la información actualizada del sistema al momento de la generación.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {reportes.map((reporte) => (
            <div
              key={reporte.tipo}
              className="card"
              style={{
                borderLeft: `4px solid ${reporte.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginRight: '1rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}>
                  {reporte.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    margin: '0 0 0.25rem 0',
                    color: '#1f2937'
                  }}>
                    {reporte.nombre}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {reporte.descripcion}
                  </p>
                </div>
              </div>

              <button
                onClick={() => descargarPDF(reporte.tipo)}
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  backgroundColor: reporte.color,
                  borderColor: reporte.color
                }}
              >
                {downloadingType === reporte.tipo ? (
                  <>
                    <div
                      style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '0.5rem'
                      }}
                    />
                    Generando...
                  </>
                ) : (
                  <>📄 Descargar PDF</>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 className="card-header">💡 Consejos</h2>
          <ul style={{
            color: '#6b7280',
            paddingLeft: '1.5rem',
            margin: 0
          }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Los reportes se generan con la información más reciente de la base de datos
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Puedes abrir los PDF descargados con cualquier lector de PDF
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Los reportes incluyen fecha y hora de generación
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Si un reporte está vacío, significa que no hay datos registrados en esa categoría
            </li>
          </ul>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}