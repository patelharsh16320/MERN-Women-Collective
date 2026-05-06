import React, { useState } from "react";
import PasswordInput from "./components/PasswordInput";
import styled from "styled-components";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // For demo: store password in localStorage (not secure, just for demo)
  const storedPassword = localStorage.getItem("userPassword") || "password";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (oldPassword !== storedPassword) {
      setError("Old password is incorrect.");
      return;
    }
    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    localStorage.setItem("userPassword", newPassword);
    setSuccess(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Wrapper>
      <h2>Change Password</h2>
      <form className="password-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label>Old Password</label>
          <PasswordInput value={oldPassword} onChange={e => setOldPassword(e.target.value)} required placeholder="Old Password" />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <PasswordInput value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="New Password" />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <PasswordInput value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm New Password" />
        </div>
        <button type="submit">Update Password</button>
        {success && <div className="success-msg">Password updated!</div>}
        {error && <div className="error-msg">{error}</div>}
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  max-width: 400px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem;
  h2 {
    margin-bottom: 1.5rem;
  }
  .password-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .success-msg {
    color: green;
    margin-top: 1rem;
    font-weight: 500;
  }
  .error-msg {
    color: red;
    margin-top: 1rem;
    font-weight: 500;
  }
`;

export default ChangePassword;
