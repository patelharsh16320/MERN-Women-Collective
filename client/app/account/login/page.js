"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";
import { toastMessage } from "../../../utils/toastMessage";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Save token + user
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      window.dispatchEvent(new Event("userChanged"));

      toastMessage.success("Login successful!");

      // Redirect
      if (response.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (err) {
      setError(err.message || "Invalid credentials");
      toastMessage.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="text-center mb-3">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3" style={{ position: "relative" }}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: 35,
                border: "none",
                background: "none",
                cursor: "pointer"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-3">
            Don’t have an account? <a href="/account/signup">Signup</a>
          </p>

        </form>
      </div>
    </div>
  );
}