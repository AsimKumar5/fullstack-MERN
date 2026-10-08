import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp } from "lucide-react";
import { clearAuthFeedback, reset } from "../store/authSlice";

function ResetPassword() {
  const dispatch = useDispatch();
  const { status, error, message } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(clearAuthFeedback());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthFeedback());
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    await dispatch(reset({ token, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">
            <TrendingUp size={40} />
          </div>
          <h1>StockMarket</h1>
          <p>Choose a new password for your account.</p>
        </div>

        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Reset password</h2>
            <p>Your reset link is valid for 15 minutes and can only be used once.</p>

            {(validationError || error) && (
              <div className="error-message">{validationError || error}</div>
            )}
            {message && <div className="status-success">{message}</div>}

            {!token ? (
              <p>This password reset link is invalid or expired.</p>
            ) : message ? (
              <div className="auth-footer">
                <Link to="/login">Go to login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter your new password again"
                  />
                </div>

                <button className="primary-button" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Updating password..." : "Update password"}
                </button>
              </form>
            )}

            {!message && (
              <div className="auth-footer">
                <Link to="/login">Back to login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
