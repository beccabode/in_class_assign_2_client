import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendRequest } from "../utils/api";
import type { RegisterResponse } from "../types/auth";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!username || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await sendRequest("/auth/register", "POST", {
        username,
        password,
      });

      const data: RegisterResponse | { message: string } = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccessMessage(data.message);
      navigate("/");
    } catch {
      setError("Something went wrong while creating the account.");
    }
    
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Register</h1>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;