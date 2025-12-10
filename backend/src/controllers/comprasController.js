import connection from "../config/db.js";

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

export const crear = (req, res) => {
    const { proveedorId, productoId, cantidad } = req.body;

    if (!proveedorId || !productoId || !cantidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
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
                "INSERT INTO compras(proveedorId, productoId, cantidad) VALUES (?,?,?)",
                [proveedorId, productoId, cantidad],
                (err) => {
                    if (err) {
                        return conn.rollback(() => {
                            conn.release();
                            res.status(500).json({ error: err.message });
                        });
                    }

                    conn.query(
                        "UPDATE productos SET stock = stock + ? WHERE id = ?",
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
                                res.json({ msg: "Compra registrada y stock actualizado" });
                            });
                        }
                    );
                }
            );
        });
    });
};