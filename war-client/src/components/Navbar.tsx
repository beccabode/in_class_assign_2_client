import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>

        {userId && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/game">Game</Link>
            <Link to="/history">History</Link>
          </>
        )}

        <div style={{ marginLeft: "auto" }}>
          {userId && <span style={{ marginRight: "1rem" }}>Logged in user ID: {userId}</span>}
          {userId && <button onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;