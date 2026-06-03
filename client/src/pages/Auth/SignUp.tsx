import React, { useState } from "react";
import "./Auth.css";

export const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign Up:", { name, email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-icon">
              <svg width="56" height="56" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="8" height="8" rx="5" fill="currentColor" opacity="0.9" />
                <rect x="12" y="2" width="8" height="8" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="2" y="12" width="8" height="8" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="12" y="12" width="8" height="8" rx="5" fill="currentColor" />
              </svg>
            </span>
          </div>

          <h1>Join Jeni</h1>
          <p>Create your account</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="auth-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
        <div className="auth-divider">
          <span>or</span>
        </div>
        <div className="auth-footer">
          Already have an account? <a href="/">Sign In</a>
        </div>
      </div>
    </div>
  );
};
