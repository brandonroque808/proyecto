import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Usuario registrado: ${nombre} (${email})`);
    navigate("/login"); // redirige a login
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <h2>Registro de Usuario</h2>
        <input 
          type="text" 
          placeholder="Nombre" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
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
        <button type="submit" style={{ marginTop: "10px" }}>Registrar</button>

        <p style={{ marginTop: "10px" }}>
          ¿Ya tienes cuenta?{" "}
          <span 
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/login")}
          >
            Inicia sesión aquí
          </span>
        </p>
      </form>
    </div>
  );
}
