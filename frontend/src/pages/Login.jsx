import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaActual, setCaptchaActual] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const navigate = useNavigate();

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const refreshCaptcha = () => {
    setCaptchaActual(generateCaptcha());
    setCaptchaInput("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (captchaInput.toUpperCase() !== captchaActual) {
      setError("CAPTCHA incorrecto");
      refreshCaptcha();
      return;
    }

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.nombre);

      setToken(res.data.token);
      setError("");

      navigate("/dashboard");
    } catch (err) {
      console.error("Error en login:", err);
      setError(
        err.response?.data?.error ||
        "Error al iniciar sesión. Verifica tus credenciales."
      );
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📦</div>
          <h1 className="auth-title">Sistema de Inventario</h1>
          <p style={{ color: '#6b7280' }}>Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Verificación CAPTCHA</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                background: '#f3f4f6',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                letterSpacing: '0.5rem',
                fontFamily: 'monospace',
                userSelect: 'none',
                border: '2px dashed #9ca3af'
              }}>
                {captchaActual}
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="btn btn-secondary btn-sm"
                disabled={loading}
                style={{ padding: '0.5rem' }}
                title="Generar nuevo código"
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Escribe el código de arriba"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
              disabled={loading}
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            ¿No tienes cuenta?{" "}
            <span
              className="auth-link"
              onClick={() => !loading && navigate("/registro")}
              style={{ pointerEvents: loading ? 'none' : 'auto' }}
            >
              Regístrate aquí
            </span>
          </p>
        </form>

        {/* Credenciales de prueba */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f3f4f6',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <strong>💡 Tip:</strong> Si es tu primera vez, crea una cuenta nueva
        </div>
      </div>
    </div>
  );
}