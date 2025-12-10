import connection from "../config/db.js";

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

export const crear = (req, res) => {
    const { clienteId, productoId, cantidad } = req.body;

    if (!clienteId || !productoId || !cantidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

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

            connection.getConnection((err, conn) => {
                if (err) {
                    console.error("Error al obtener conexión:", err);
                    return res.status(500).json({ error: "Error de conexión a la base de datos" });
                }

                conn.beginTransaction((err) => {
                    if (err) {
                        conn.release();
                        return res.status(500).json({ error: err.message });
                    }

                    conn.query(
                        "INSERT INTO ventas(clienteId, productoId, cantidad) VALUES (?,?,?)",
                        [clienteId, productoId, cantidad],
                        (err) => {
                            if (err) {
                                return conn.rollback(() => {
                                    conn.release();
                                    res.status(500).json({ error: err.message });
                                });
                            }

                            conn.query(
                                "UPDATE productos SET stock = stock - ? WHERE id = ?",
                                [cantidad, productoId],
                                (err) => {
                                    if (err) {
                                        return conn.rollback(() => {
                                            conn.release();
                                            res.status(500).json({ error: err.message });
                                        });
                                    }

                                    conn.commit((err) => {
                                        if (err) {
                                            return conn.rollback(() => {
                                                conn.release();
                                                res.status(500).json({ error: err.message });
                                            });
                                        }
                                        conn.release();
                                        res.json({ msg: "Venta registrada y stock actualizado" });
                                    });
                                }
                            );
                        }
                    );
                });
            });
        }
    );
};