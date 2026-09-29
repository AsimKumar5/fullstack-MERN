import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { loginUser } from "../api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {

            setError(
                "Please enter email and password."
            );

            return;
        }

        try {
                const data = await loginUser(formData);
                console.log("✅ Login successful:", data);
                // Store token if needed
                localStorage.setItem("authToken", data.token);
                navigate("/dashboard");
        } catch (error) {
            setError("Error connecting to server: " + error.message);
            console.error("Login error:", error);
        }

    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* Left side */}

                <div className="auth-brand">

                    <div className="brand-icon">
                        <TrendingUp size={40} />
                    </div>

                    <h1>
                        StockMarket
                    </h1>

                    <p>
                        Real-Time Stock Market
                        Management System
                    </p>

                </div>


                {/* Login form */}

                <div className="auth-form-container">

                    <div className="auth-form">

                        <h2>
                            Welcome Back
                        </h2>

                        <p>
                            Login to manage your
                            investments.
                        </p>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="form-options">

                                <label>

                                    <input
                                        type="checkbox"
                                    />

                                    Remember me

                                </label>

                                <Link to="/forgot-password">
                                    Forgot password?
                                </Link>

                            </div>


                            <button
                                type="submit"
                                className="primary-button"
                            >
                                Login
                            </button>

                        </form>


                        <div className="auth-footer">

                            <span>
                                Don't have an account?
                            </span>

                            <Link to="/register">
                                Create Account
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;