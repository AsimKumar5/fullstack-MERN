import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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