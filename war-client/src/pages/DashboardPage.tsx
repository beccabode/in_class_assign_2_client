import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome to the War card game.</p>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate("/game")}>Start / Continue Game</button>
        <button onClick={() => navigate("/history")}>View Game History</button>
      </div>
    </div>
  );
}

export default DashboardPage;