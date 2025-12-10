import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones básicas
    if (!nombre || !email || !password) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      console.log("Enviando datos:", { nombre, email, password }); // Debug
      
      const response = await api.post("/auth/registro", {
        nombre,
        email,
        password,
        rol: "usuario"
      });

      console.log("Respuesta del servidor:", response.data); // Debug
      
      alert(`¡Usuario registrado exitosamente!\nFuerza de contraseña: ${response.data.fuerza || 'N/A'}`);
      navigate("/login");
    } catch (err) {
      console.error("Error al registrar:", err); // Debug
      console.error("Respuesta del error:", err.response?.data); // Debug
      
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Error al registrar usuario. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          width: "300px",
          gap: "10px"
        }}
      >
        <h2>Registro de Usuario</h2>
        
        {error && (
          <div style={{ 
            color: "red", 
            padding: "10px", 
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#ffe6e6"
          }}>
            {error}
          </div>
        )}

        <input 
          type="text" 
          placeholder="Nombre" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required
          style={{ padding: "8px", fontSize: "14px" }}
        />
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{ padding: "8px", fontSize: "14px" }}
        />
        
        <input 
          type="password" 
          placeholder="Contraseña (mínimo 6 caracteres)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          minLength="6"
          style={{ padding: "8px", fontSize: "14px" }}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            marginTop: "10px",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          ¿Ya tienes cuenta?{" "}
          <span 
            style={{ 
              color: "blue", 
              cursor: "pointer", 
              textDecoration: "underline" 
            }}
            onClick={() => navigate("/login")}
          >
            Inicia sesión aquí
          </span>
        </p>
      </form>
    </div>
  );
}