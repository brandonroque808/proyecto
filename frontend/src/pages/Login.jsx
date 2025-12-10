import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Asegúrate de tener api.js con la baseURL correcta

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaActual, setCaptchaActual] = useState(generateCaptcha());
  const navigate = useNavigate();

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const inputCaptcha = e.target.captchaInput.value.toUpperCase();

    if (inputCaptcha !== captchaActual) {
      setError("CAPTCHA incorrecto");
      setCaptchaActual(generateCaptcha());
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
      setCaptchaActual(generateCaptcha());
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ margin: "10px 0" }}>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>{captchaActual}</span>
          <input name="captchaInput" type="text" placeholder="Escribe el CAPTCHA" required />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>Ingresar</button>

        <p style={{ marginTop: "10px" }}>
          ¿No tienes cuenta?{" "}
          <span
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/registro")}
          >
            Regístrate aquí
          </span>
        </p>
      </form>
    </div>
  );
}
