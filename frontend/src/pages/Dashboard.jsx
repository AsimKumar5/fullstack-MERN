import { useEffect, useState } from "react";
import {
    Wallet,
    IndianRupee,
    TrendingUp,
    Activity
} from "lucide-react";

import MarketCard from "../components/MarketCard";
import StockCard from "../components/StockCard";
import PriceChart from "../components/PriceChart";
import { getDashboard } from "../api";

function Dashboard() {

    const [backendMessage, setBackendMessage] = useState("");
    const [dashboard, setDashboard] = useState({ marketData: [], topStocks: [], recentTransactions: [], chartData: [] });

    // Test connection to backend
    useEffect(() => {
        getDashboard()
            .then((data) => {
                setDashboard(data);
                setBackendMessage("Backend connected successfully");
            })
            .catch((error) => {
                console.error("❌ Connection failed:", error);
                setBackendMessage("Could not connect to backend");
            });
    }, []);

    const { marketData, topStocks, recentTransactions, chartData } = dashboard;


    return (

        <div className="dashboard">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Good Morning, Investor 👋
                    </h1>

                    <p>
                        {backendMessage || "Here's what's happening with your investments today."}
                    </p>

                </div>

                <div className="market-status">

                    <span className="status-dot"></span>

                    Market Open

                </div>

            </div>


            {/* =========================
                PORTFOLIO SUMMARY
            ========================= */}

            <div className="stats-grid">


                {/* Portfolio Value */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <Wallet size={24} />

                    </div>

                    <div>

                        <span>
                            Portfolio Value
                        </span>

                        <h2>
                            ₹1,25,450
                        </h2>

                        <small className="positive">

                            +₹5,450 today

                        </small>

                    </div>

                </div>


                {/* Investment */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <IndianRupee size={24} />

                    </div>

                    <div>

                        <span>
                            Total Investment
                        </span>

                        <h2>
                            ₹1,10,000
                        </h2>

                        <small>
                            12 Holdings
                        </small>

                    </div>

                </div>


                {/* Profit */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <TrendingUp size={24} />

                    </div>

                    <div>

                        <span>
                            Total Profit
                        </span>

                        <h2 className="positive">
                            +₹15,450
                        </h2>

                        <small className="positive">
                            +14.04%
                        </small>

                    </div>

                </div>


                {/* Today's Change */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <Activity size={24} />

                    </div>

                    <div>

                        <span>
                            Today's Change
                        </span>

                        <h2 className="positive">
                            +2.45%
                        </h2>

                        <small>
                            Compared to yesterday
                        </small>

                    </div>

                </div>

            </div>


            {/* =========================
                MARKET OVERVIEW
            ========================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Market Overview
                        </h2>

                        <p>
                            Current market indices
                        </p>

                    </div>

                    <span className="live-indicator">
                        ● Live
                    </span>

                </div>


                <div className="market-grid">

                    {marketData.map((market) => (

                        <MarketCard
                            key={market.name}
                            {...market}
                        />

                    ))}

                </div>

            </div>


            {/* =========================
                PORTFOLIO CHART
            ========================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Portfolio Performance
                        </h2>

                        <p>
                            Track your portfolio growth
                        </p>

                    </div>

                    <select>

                        <option>
                            1 Week
                        </option>

                        <option>
                            1 Month
                        </option>

                        <option>
                            6 Months
                        </option>

                        <option>
                            1 Year
                        </option>

                    </select>

                </div>


                <PriceChart data={chartData} />

            </div>


            {/* =========================
                TOP STOCKS
            ========================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Popular Stocks
                        </h2>

                        <p>
                            Today's market movers
                        </p>

                    </div>

                </div>


                <div className="stock-grid">

                    {topStocks.map((stock) => (

                        <StockCard
                            key={stock.symbol}
                            {...stock}
                        />

                    ))}

                </div>

            </div>


            {/* =========================
                RECENT TRANSACTIONS
            ========================= */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Recent Transactions
                        </h2>

                        <p>
                            Your latest trading activity
                        </p>

                    </div>

                    <a
                        href="/transactions"
                        className="view-all"
                    >
                        View All
                    </a>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Quantity
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Total
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {recentTransactions.map(
                                (transaction) => {

                                    const total =
                                        (transaction.qty || 0) *
                                        (transaction.amount || 0);

                                    return (

                                        <tr
                                            key={transaction.id}
                                        >

                                            <td>
                                                {transaction.date}
                                            </td>

                                            <td>

                                                <strong>
                                                    {transaction.stock}
                                                </strong>

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        transaction.type ===
                                                        "BUY"
                                                            ? "transaction-buy"
                                                            : "transaction-sell"
                                                    }
                                                >
                                                    {transaction.type}
                                                </span>

                                            </td>

                                            <td>
                                                {transaction.qty || 0}
                                            </td>

                                            <td>
                                                ₹
                                                {(transaction.amount || 0).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td>
                                                ₹
                                                {(transaction.amount || 0).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );
}

export default Dashboard;