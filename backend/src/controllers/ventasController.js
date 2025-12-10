import connection from "../config/db.js";

// Listar historial de ventas con detalles
export const listar = (req, res) => {
    const sql = `
        SELECT 
            v.id, 
            v.cantidad, 
            v.fecha,
            p.nombre as productoNombre,
            c.nombre as clienteNombre
        FROM ventas v
        JOIN productos p ON v.productoId = p.id
        JOIN clientes c ON v.clienteId = c.id
        ORDER BY v.fecha DESC
    `;

    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// Registrar venta (reduce stock)
export const crear = (req, res) => {
    const { clienteId, productoId, cantidad } = req.body;

    if (!clienteId || !productoId || !cantidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar stock disponible
    connection.query(
        "SELECT stock FROM productos WHERE id = ?",
        [productoId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (result.length === 0) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            const stockActual = result[0].stock;
            
            if (stockActual < cantidad) {
                return res.status(400).json({ 
                    error: `Stock insuficiente. Disponible: ${stockActual}` 
                });
            }

            // Iniciar transacción
            connection.beginTransaction((err) => {
                if (err) return res.status(500).json({ error: err.message });

                // Insertar venta
                connection.query(
                    "INSERT INTO ventas(clienteId, productoId, cantidad) VALUES (?,?,?)",
                    [clienteId, productoId, cantidad],
                    (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).json({ error: err.message });
                            });
                        }

                        // Reducir stock del producto
                        connection.query(
                            "UPDATE productos SET stock = stock - ? WHERE id = ?",
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
                                    res.json({ msg: "Venta registrada y stock actualizado" });
                                });
                            }
                        );
                    }
                );
            });
        }
    );
};