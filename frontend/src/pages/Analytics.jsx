import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { getAnalytics } from "../api";

const initialAnalytics = {
    summary: { investment: 0, currentValue: 0, profit: 0, returnPercent: 0 },
    portfolioData: [],
    stockPerformance: [],
    portfolioDistribution: [],
    holdings: [],
};

const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;

function Analytics() {
    const [analytics, setAnalytics] = useState(initialAnalytics);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isCurrentRequest = true;

        getAnalytics()
            .then((data) => {
                if (isCurrentRequest) {
                    setAnalytics({ ...initialAnalytics, ...data });
                    setStatus("succeeded");
                }
            })
            .catch((requestError) => {
                if (isCurrentRequest) {
                    setError(requestError.message || "Unable to load analytics.");
                    setStatus("failed");
                }
            });

        return () => {
            isCurrentRequest = false;
        };
    }, [retryCount]);

    const { summary, portfolioData, stockPerformance, portfolioDistribution, holdings } =
        analytics;
    const isProfit = summary.profit >= 0;

    return (
        <div className="analytics-page">
            <div className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <p>Analyze your portfolio performance and investment distribution.</p>
                </div>
            </div>

            {status === "loading" && (
                <div className="stocks-state" role="status">
                    <span className="transaction-spinner" />
                    <strong>Loading your analytics</strong>
                </div>
            )}

            {status === "failed" && (
                <div className="stocks-state stocks-state-error" role="alert">
                    <strong>We couldn’t load your analytics</strong>
                    <p>{error}</p>
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={() => {
                            setError("");
                            setStatus("loading");
                            setRetryCount((current) => current + 1);
                        }}
                    >
                        Try again
                    </button>
                </div>
            )}

            {status === "succeeded" && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span>Total Investment</span>
                            <h2>{formatMoney(summary.investment)}</h2>
                        </div>
                        <div className="stat-card">
                            <span>Current Value</span>
                            <h2>{formatMoney(summary.currentValue)}</h2>
                        </div>
                        <div className="stat-card">
                            <span>Total Return</span>
                            <h2 className={isProfit ? "positive" : "negative"}>
                                {isProfit ? "+" : ""}{Number(summary.returnPercent || 0).toFixed(2)}%
                            </h2>
                        </div>
                        <div className="stat-card">
                            <span>Total Profit / Loss</span>
                            <h2 className={isProfit ? "positive" : "negative"}>
                                {isProfit ? "+" : "-"}{formatMoney(Math.abs(summary.profit || 0))}
                            </h2>
                        </div>
                    </div>

                    <div className="analytics-card">
                        <div className="section-header">
                            <div>
                                <h2>Portfolio Performance</h2>
                                <p>Historical portfolio values, when price history is available.</p>
                            </div>
                        </div>
                        <div className="chart-container">
                            {portfolioData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={portfolioData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#2563eb" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="stocks-state">
                                    <strong>Historical price data isn’t available yet</strong>
                                    <p>
                                        Current portfolio totals and holding performance are shown below;
                                        no historical values are estimated.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <h2>Stock Performance</h2>
                            <p>Unrealized profit or loss for each current holding.</p>
                            <div className="chart-container">
                                {stockPerformance.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={stockPerformance}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatMoney(value)} />
                                            <Bar dataKey="profit" fill="#2563eb" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="stocks-state">
                                        <strong>No current holdings to analyze</strong>
                                        <p>Your stock performance will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="analytics-card">
                            <h2>Portfolio Distribution</h2>
                            <p>Current value of each stock holding.</p>
                            <div className="chart-container">
                                {portfolioDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={portfolioDistribution}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label
                                            >
                                                {portfolioDistribution.map((entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={[
                                                            "#2563eb",
                                                            "#16a34a",
                                                            "#f59e0b",
                                                            "#dc2626",
                                                            "#8b5cf6",
                                                            "#06b6d4",
                                                        ][index % 6]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatMoney(value)} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="stocks-state">
                                        <strong>Your portfolio is empty</strong>
                                        <p>Distribution appears when you have open holdings.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="analytics-card">
                        <h2>Stock Analysis</h2>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Stock</th>
                                        <th>Quantity</th>
                                        <th>Investment</th>
                                        <th>Current Value</th>
                                        <th>Profit / Loss</th>
                                        <th>Return</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holdings.map((holding) => {
                                        const positive = holding.profit >= 0;
                                        return (
                                            <tr key={holding.symbol}>
                                                <td>{holding.company} ({holding.symbol})</td>
                                                <td>{holding.quantity}</td>
                                                <td>{formatMoney(holding.investment)}</td>
                                                <td>{formatMoney(holding.currentValue)}</td>
                                                <td className={positive ? "positive" : "negative"}>
                                                    {positive ? "+" : "-"}{formatMoney(Math.abs(holding.profit))}
                                                </td>
                                                <td className={positive ? "positive" : "negative"}>
                                                    {positive ? "+" : ""}
                                                    {Number(holding.returnPercent || 0).toFixed(2)}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {holdings.length === 0 && (
                                        <tr>
                                            <td colSpan="6">No open holdings to analyze.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Analytics;
