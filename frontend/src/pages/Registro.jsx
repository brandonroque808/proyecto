import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const evaluarPassword = (pwd) => {
    if (!pwd) {
      setPasswordStrength("");
      return;
    }

    let nivel = "débil";
    let color = "#ef4444";
    let porcentaje = 33;

    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
      nivel = "muy fuerte";
      color = "#059669";
      porcentaje = 100;
    } else if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd)) {
      nivel = "fuerte";
      color = "#10b981";
      porcentaje = 80;
    } else if (pwd.length >= 6 && (/[A-Z]/.test(pwd) || /\d/.test(pwd))) {
      nivel = "intermedia";
      color = "#f59e0b";
      porcentaje = 60;
    }

    setPasswordStrength({ nivel, color, porcentaje });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    evaluarPassword(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validateEmail(email)) {
      setError("El email no es válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/registro", {
        nombre,
        email,
        password,
        rol: "usuario"
      });

      const fuerza = response.data.fuerza || passwordStrength.nivel || "N/A";

      const successModal = document.createElement("div");
      successModal.className = "modal-overlay";
      successModal.innerHTML = `
        <div class="modal">
          <div class="modal-header">✅ Registro Exitoso</div>
          <div class="modal-body">
            <p><strong>¡Cuenta creada correctamente!</strong></p>
            <p>Nombre: ${nombre}</p>
            <p>Email: ${email}</p>
            <p>Fortaleza de contraseña: <strong>${fuerza}</strong></p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
              Ir al Login
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(successModal);

      setTimeout(() => {
        successModal.remove();
        navigate("/login");
      }, 3000);

    } catch (err) {
      console.error("Error al registrar:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error al registrar usuario. El email podría estar en uso."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</div>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p style={{ color: '#6b7280' }}>Completa el formulario para registrarte</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={handlePasswordChange}
              required
              minLength="6"
              disabled={loading}
            />

            {passwordStrength && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Fortaleza:
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: passwordStrength.color
                  }}>
                    {passwordStrength.nivel}
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: '#e5e7eb',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${passwordStrength.porcentaje}%`,
                    background: passwordStrength.color,
                    transition: 'all 0.3s'
                  }}></div>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                  marginBottom: 0
                }}>
                  Usa mayúsculas, números y símbolos para mayor seguridad
                </p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            ¿Ya tienes cuenta?{" "}
            <span
              className="auth-link"
              onClick={() => !loading && navigate("/login")}
              style={{ pointerEvents: loading ? 'none' : 'auto' }}
            >
              Inicia sesión aquí
            </span>
          </p>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f3f4f6',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <strong>🔒 Seguridad:</strong> Tu contraseña será encriptada antes de almacenarse
        </div>
      </div>
    </div>
  );
}