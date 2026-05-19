import React, { useState } from "react";
import PasswordInput from "./components/PasswordInput";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      if (response.success) {
        // Save Token
        localStorage.setItem("token", response.token);

        // Save User Data
        localStorage.setItem(
          "userData",
          JSON.stringify(response.user)
        );

        // Login Status
        localStorage.setItem("isLoggedIn", "true");

        // Role Based Redirect
        if (response.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      } else {
        alert(response.message);
      }

    } catch (error) {
      console.log(error);

      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;