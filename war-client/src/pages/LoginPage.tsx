import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { sendRequest } from "../utils/api";
import type { LoginResponse } from "../types/auth";

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
      const response = await sendRequest("/auth/login", "POST", {
        username,
        password,
      });

      const data: LoginResponse | { message: string } = await response.json();

      if (!response.ok) {
        if ("message" in data) {
          setError(data.message);
        } else {
          setError("Login failed.");
        }
        return;
      }

      if ("userId" in data) {
        login(String(data.userId));
        navigate("/dashboard");
      } else {
        setError("Login response did not include a user ID.");
      }
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