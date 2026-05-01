"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";
import { toastMessage } from "../../../utils/toastMessage";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
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
      const response = await fetchAPI("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      // Save user
      localStorage.setItem("user", JSON.stringify(response.user));
      window.dispatchEvent(new Event("userChanged"));

      toastMessage.success("Account created!");

      router.push("/account/login");

    } catch (err) {
      setError(err.message || "Signup failed");
      toastMessage.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">

        <h2>Create Account</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>

          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            {loading ? "Creating..." : "Signup"}
          </button>

          <p className="text-center mt-3">
            Already have an account? <a href="/account/login">Login</a>
          </p>

        </form>
      </div>
    </div>
  );
}