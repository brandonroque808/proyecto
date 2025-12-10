import connection from "../config/db.js";

// Listar historial de compras con detalles
export const listar = (req, res) => {
    const sql = `
        SELECT 
            c.id, 
            c.cantidad, 
            c.fecha,
            p.nombre as productoNombre,
            prov.nombre as proveedorNombre
        FROM compras c
        JOIN productos p ON c.productoId = p.id
        JOIN proveedores prov ON c.proveedorId = prov.id
        ORDER BY c.fecha DESC
    `;

    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// Registrar compra (incrementa stock)
export const crear = (req, res) => {
    const { proveedorId, productoId, cantidad } = req.body;

    if (!proveedorId || !productoId || !cantidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Iniciar transacción
    connection.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Insertar compra
        connection.query(
            "INSERT INTO compras(proveedorId, productoId, cantidad) VALUES (?,?,?)",
            [proveedorId, productoId, cantidad],
            (err) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }

                // Incrementar stock del producto
                connection.query(
                    "UPDATE productos SET stock = stock + ? WHERE id = ?",
                    [cantidad, productoId],
                    (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ error: err.message });
                            });
                        }

                        // Confirmar transacción
                        connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    res.status(500).json({ error: err.message });
                                });
                            }
                            res.json({ msg: "Compra registrada y stock actualizado" });
                        });
                    }
                );
            }
        );
    });
};