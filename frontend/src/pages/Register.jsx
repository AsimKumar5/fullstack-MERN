import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { clearAuthFeedback, register } from "../store/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setValidationError("Please fill in all fields.");

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");

      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must contain at least 6 characters.");

      return;
    }

    const { confirmPassword, ...payload } = formData;
    const result = await dispatch(register({
      ...payload,
      confirmPassword,
    }));
    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="auth-page auth-register-page">
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

            {(validationError || error) && (
              <div className="error-message">{validationError || error}</div>
            )}

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

              <button type="submit" className="primary-button" disabled={status === "loading"}>
                {status === "loading" ? "Creating account..." : "Create Account"}
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
