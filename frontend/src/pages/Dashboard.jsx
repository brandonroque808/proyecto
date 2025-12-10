import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Bienvenido al Dashboard</h1>
        <p>Selecciona una sección del menú para empezar a administrar tu tienda online.</p>
      </div>
    </div>
  );
}
