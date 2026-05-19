import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./components/PasswordInput";
import { signupUser } from "./api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await signupUser({
        ...formData,
        role: "user",
      });

      if (response.success) {
        // Save Token
        localStorage.setItem("token", response.token);

        // Save User Data
        localStorage.setItem(
          "userData",
          JSON.stringify(response.user)
        );

        localStorage.setItem("isLoggedIn", "true");

        alert("Signup successful");

        // Redirect User
        navigate("/");

      } else {
        alert(response.message);
      }

    } catch (error) {
      console.log(error);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <PasswordInput
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Signup"}
        </button>

      </form>

      <p>
        Already have an account?{" "}
        <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;