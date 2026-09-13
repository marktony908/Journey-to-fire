import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your details."
        );
      }

      localStorage.setItem("journey_fire_token", data.token);
      localStorage.setItem(
        "journey_fire_admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-glow"></div>

      <div className="admin-login-card">
        <div className="admin-login-logo">
          🔥
        </div>

        <p className="admin-eyebrow">
          JOURNEY TO FIRE
        </p>

        <h1>
          Welcome <span>Back</span>
        </h1>

        <p className="admin-login-subtitle">
          Sign in to manage your investors and leads.
        </p>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-input-group">
            <label htmlFor="email">
              EMAIL ADDRESS
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-input-group">
            <label htmlFor="password">
              PASSWORD
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            <span>
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </span>

            <span className="admin-login-arrow">
              {loading ? "..." : "→"}
            </span>
          </button>

        </form>

        <button
          className="back-home-button"
          onClick={() => navigate("/")}
          type="button"
        >
          ← Back to Journey
        </button>

        <div className="admin-login-footer">
          <span>SECURE ADMIN AREA</span>
          <span>•</span>
          <span>JOURNEY TO FIRE</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;