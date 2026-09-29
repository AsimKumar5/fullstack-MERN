import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { registerUser } from "../api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");

      return;
    }

    try {
      const { confirmPassword, ...payload } = formData;

      const data = await registerUser({
        ...payload,
        confirmPassword,
      });
      console.log("✅ Registration successful:", data);
      navigate("/login");
    } catch (error) {
      setError("Error connecting to server: " + error.message);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Brand */}

        <div className="auth-brand">
          <div className="brand-icon">
            <TrendingUp size={40} />
          </div>

          <h1>StockMarket</h1>

          <p>Start managing your investments today.</p>
        </div>

        {/* Registration */}

        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Create Account</h2>

            <p>Create your investor account.</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <label className="terms">
                <input type="checkbox" required />

                <span>I agree to the terms and conditions.</span>
              </label>

              <button type="submit" className="primary-button">
                Create Account
              </button>
            </form>

            <div className="auth-footer">
              <span>Already have an account?</span>

              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
