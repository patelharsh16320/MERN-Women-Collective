import React, { useState } from "react";
import PasswordInput from "./components/PasswordInput";
import { useNavigate } from "react-router-dom";
import { userDemoData } from "./MyAccount";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login logic
    if (
      (email === "user@example.com" && password === "password") ||
      (email === "harsh@gmail.com" && password === "password")
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify(userDemoData[email]));
      navigate("/");
    } else {
      alert("Invalid credentials. Try user@example.com / password or harsh@gmail.com / password");
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
