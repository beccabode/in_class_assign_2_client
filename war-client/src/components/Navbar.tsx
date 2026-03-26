import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { user, logout, token } = useAuth();
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

        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/game">Game</Link>
            <Link to="/history">History</Link>
          </>
        )}

        <div style={{ marginLeft: "auto" }}>
          {user && <span style={{ marginRight: "1rem" }}>Logged in as: {user.username}</span>}
          {token && <button onClick={handleLogout}>Logout</button>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;