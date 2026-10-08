import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { clearAuthFeedback, requestReset } from "../store/authSlice";

function ForgotPassword() {
  const dispatch = useDispatch();
  const { status, error, message, resetUrl } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(clearAuthFeedback());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthFeedback());
    await dispatch(requestReset(email));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">
            <TrendingUp size={40} />
          </div>
          <h1>StockMarket</h1>
          <p>Get back to managing your investments.</p>
        </div>

        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Forgot password?</h2>
            <p>Enter your account email to create a password reset link.</p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="status-success">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-email">Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <button className="primary-button" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Creating link..." : "Create reset link"}
              </button>
            </form>

            {resetUrl && (
              <p>
                Development reset link:{" "}
                <a href={resetUrl}>Reset your password</a>
              </p>
            )}

            <div className="auth-footer">
              <Link to="/login">Back to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
