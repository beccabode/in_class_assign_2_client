import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
// import { sendRequest } from "../utils/api";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      // TEMPORARY fake login for development
      if (!username || !password) {
        setError("Please enter username and password.");
        return;
      }

      login("fake-token-123", { id: "1", username });
      navigate("/dashboard");

      // REAL VERSION LATER:
      // const response = await sendRequest("/auth/login", "POST", { username, password });
      // const data = await response.json();
      // if (!response.ok) {
      //   setError(data.message || "Login failed.");
      //   return;
      // }
      // login(data.token, data.user);
      // navigate("/dashboard");
    } catch {
      setError("Something went wrong while logging in.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: "300px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Log In</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Need an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;