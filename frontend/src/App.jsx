import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import StockDetails from "./pages/StockDetails";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import AdminPanel from "./pages/AdminPanel";
import { sessionExpired } from "./store/authSlice";
import "./App.css";

function AuthSessionHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(sessionExpired());
      navigate("/login", {
        replace: true,
        state: { message: "Your session expired. Please log in again." },
      });
    };

    window.addEventListener("authSessionExpired", handleSessionExpired);
    return () => window.removeEventListener("authSessionExpired", handleSessionExpired);
  }, [dispatch, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthSessionHandler />
      <Routes>

        <Route path="/" element={<Home />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Main application */}
        <Route
          path="*"
          element={
            <div className="app">

              <Navbar />

              <div className="main-layout">

                <Sidebar />

                <main className="content">

                  <Routes>

                    <Route
                      path="/dashboard"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/stocks"
                      element={<Stocks />}
                    />

                    <Route
                      path="/stocks/:symbol"
                      element={<StockDetails />}
                    />

                    <Route
                      path="/portfolio"
                      element={<Portfolio />}
                    />

                    <Route
                      path="/transactions"
                      element={<Transactions />}
                    />

                    <Route
                      path="/analytics"
                      element={<Analytics />}
                    />

                    <Route
                      path="/profile"
                      element={<Profile />}
                    />

                    <Route
                      path="/settings"
                      element={<Settings />}
                    />

                    <Route
                      path="/notifications"
                      element={<Notifications />}
                    />

                    <Route
                      path="/admin"
                      element={<AdminPanel />}
                    />

                  </Routes>

                </main>

              </div>

            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;