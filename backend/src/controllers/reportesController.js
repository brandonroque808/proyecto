import PDFDocument from "pdfkit";
import connection from "../config/db.js";

export const generarReporte = (req, res) => {
  const { tipo } = req.params;

  let sql = "";
  let titulo = "";

  switch (tipo) {
    case "inventario":
      sql = "SELECT nombre, descripcion, precio, stock FROM productos WHERE activo = 1";
      titulo = "Reporte de Inventario";
      break;
    case "clientes":
      sql = "SELECT nombre, email, telefono, direccion FROM clientes WHERE activo = 1";
      titulo = "Reporte de Clientes";
      break;
    case "proveedores":
      sql = "SELECT nombre, email, telefono, direccion FROM proveedores WHERE activo = 1";
      titulo = "Reporte de Proveedores";
      break;
    case "compras":
      sql = `SELECT 
              c.id AS ID,
              Date_Format(c.fecha, '%Y-%m-%d %H:%i') AS Fecha, 
              p.nombre AS Producto, 
              prov.nombre AS Proveedor, 
              c.cantidad AS Cantidad,
              p.precio AS 'Precio Unitario',
              (p.precio * c.cantidad) AS 'Total Gastado'
             FROM compras c
             JOIN productos p ON c.productoId = p.id
             JOIN proveedores prov ON c.proveedorId = prov.id
             ORDER BY c.fecha DESC`;
      titulo = "Reporte de Compras";
      break;
    case "ventas":
      sql = `SELECT 
              v.id AS ID,
              Date_Format(v.fecha, '%Y-%m-%d %H:%i') AS Fecha, 
              p.nombre AS Producto, 
              cl.nombre AS Cliente, 
              v.cantidad AS Cantidad,
              p.precio AS 'Precio Unitario',
              (p.precio * v.cantidad) AS 'Total Ganado'
             FROM ventas v
             JOIN productos p ON v.productoId = p.id
             JOIN clientes cl ON v.clienteId = cl.id
             ORDER BY v.fecha DESC`;
      titulo = "Reporte de Ventas";
      break;
    default:
      return res.status(400).json({ error: "Tipo de reporte inválido" });
  }

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error al generar reporte:", err);
      return res.status(500).json({ error: err.message });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${tipo}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(titulo, { align: "center" });
    doc.moveDown();

    results.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key}: ${value}`);
      });
      doc.moveDown();
    });

    doc.end();
  });
};