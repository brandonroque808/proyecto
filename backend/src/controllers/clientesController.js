import connection from "../config/db.js";

export const listar = (req, res) => {
    connection.query("SELECT * FROM clientes WHERE activo=1", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

export const crear = (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: "Nombre y email son obligatorios" });
    }

    connection.query(
        "INSERT INTO clientes(nombre, email, telefono, direccion) VALUES (?,?,?,?)",
        [nombre, email, telefono, direccion],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ msg: "Cliente creado exitosamente" });
        }
    );
};

export const actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;

    connection.query(
        "UPDATE clientes SET nombre=?, email=?, telefono=?, direccion=? WHERE id=?",
        [nombre, email, telefono, direccion, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ msg: "Cliente actualizado exitosamente" });
        }
    );
};

export const eliminar = (req, res) => {
    const { id } = req.params;

    connection.query(
        "UPDATE clientes SET activo=0 WHERE id=?",
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ msg: "Cliente eliminado" });
        }
    );
};