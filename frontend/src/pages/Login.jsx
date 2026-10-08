import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { clearAuthFeedback, login } from "../store/authSlice";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setValidationError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearAuthFeedback());
    setValidationError("");

    if (!formData.email || !formData.password) {
      setValidationError("Please enter email and password.");

      return;
    }

    const result = await dispatch(login({ ...formData, rememberMe }));
    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page auth-login-page">
      <div className="auth-container">
        {/* Left side */}

        <div className="auth-brand">
          <div className="brand-icon">
            <TrendingUp size={40} />
          </div>

          <h1>StockMarket</h1>

          <p>Real-Time Stock Market Management System</p>
        </div>

        {/* Login form */}

        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Welcome Back</h2>

            <p>Login to manage your investments.</p>

            {(validationError || error || location.state?.message) && (
              <div className="error-message">
                {validationError || error || location.state.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-options">
                <label className="remember-me-option" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-footer">
              <span>Don't have an account?</span>

              <Link to="/register">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
