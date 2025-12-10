import connection from "../config/db.js";

// Listar proveedores activos
export const listar = (req, res) => {
    connection.query("SELECT * FROM proveedores WHERE activo=1", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
};

// Crear proveedor
export const crear = (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;
    
    if (!nombre || !email) {
        return res.status(400).json({ error: "Nombre y email son obligatorios" });
    }

    connection.query(
        "INSERT INTO proveedores(nombre, email, telefono, direccion) VALUES (?,?,?,?)",
        [nombre, email, telefono, direccion],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ msg: "Proveedor creado exitosamente" });
        }
    );
};

// Actualizar proveedor
export const actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;

    connection.query(
        "UPDATE proveedores SET nombre=?, email=?, telefono=?, direccion=? WHERE id=?",
        [nombre, email, telefono, direccion, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ msg: "Proveedor actualizado exitosamente" });
        }
    );
};

// Eliminación lógica
export const eliminar = (req, res) => {
    const { id } = req.params;

    connection.query(
        "UPDATE proveedores SET activo=0 WHERE id=?",
        [id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ msg: "Proveedor eliminado" });
        }
    );
};