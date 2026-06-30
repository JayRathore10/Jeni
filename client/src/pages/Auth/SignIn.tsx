import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
      try {
    const { data } = await api.post("/auth/sign-in", {
      email,
      password,
    });

    // Save token
    localStorage.setItem("token", data.token);

    // Save user data
    localStorage.setItem("user", JSON.stringify(data.user));

    alert(data.message);

    // Redirect to dashboard
    navigate("/dashboard");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    alert(error.response?.data?.message || "Login failed");
    console.error(error);
  }
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

          <h1>Welcome back</h1>
          <p>Sign in to continue</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
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
            Sign In
          </button>
        </form>
        <div className="auth-divider">
          <span>or</span>
        </div>
        <div className="auth-footer">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;