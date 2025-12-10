import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connection } from "../db.js";

// Registrar usuario
export const registrarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Validación de fuerza de contraseña
  let fuerza = "débil";
  if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
    fuerza = "fuerte";
  } else if (password.length >= 6) {
    fuerza = "intermedia";
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    "INSERT INTO usuarios (nombre, email, password, rol, fuerza) VALUES (?, ?, ?, ?, ?)",
    [nombre, email, hashedPassword, rol || "usuario", fuerza],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Usuario registrado correctamente", fuerza });
    }
  );
};

// Login de usuario
export const loginUsuario = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  connection.query(
    "SELECT * FROM usuarios WHERE email = ? AND activo = 1",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(400).json({ error: "Usuario no encontrado" });

      const usuario = results[0];
      const match = await bcrypt.compare(password, usuario.password);

      if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });

      // Generar JWT
      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
        process.env.JWT_SECRET || "secreto",
        { expiresIn: "8h" }
      );

      res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
    }
  );
};
