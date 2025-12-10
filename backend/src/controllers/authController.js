import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../config/db.js";

export const registrarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  let fuerza = "débil";
  if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
    fuerza = "fuerte";
  } else if (password.length >= 6) {
    fuerza = "intermedia";
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
      "INSERT INTO usuarios (nombre, email, password, rol, fuerza) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol || "usuario", fuerza],
      (err, result) => {
        if (err) {
          console.error("Error al registrar usuario:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({
          message: "Usuario registrado correctamente",
          fuerza
        });
      }
    );
  } catch (error) {
    console.error("Error al encriptar password:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

export const loginUsuario = (req, res) => {
  const { email, password } = req.body;

  console.log("Intento de login:", email);

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  connection.query(
    "SELECT * FROM usuarios WHERE email = ? AND activo = 1",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Error en query:", err);
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Usuario no encontrado" });
      }

      const usuario = results[0];

      try {
        const match = await bcrypt.compare(password, usuario.password);

        if (!match) {
          return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
          { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
          process.env.JWT_SECRET || "secreto",
          { expiresIn: "8h" }
        );

        console.log("Login exitoso para:", email);

        res.json({
          token,
          nombre: usuario.nombre,
          rol: usuario.rol
        });
      } catch (error) {
        console.error("Error al comparar passwords:", error);
        res.status(500).json({ error: "Error al procesar la solicitud" });
      }
    }
  );
};