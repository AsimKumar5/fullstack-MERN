import { useEffect, useState } from "react";
import PortfolioTable from "../components/PortfolioTable";
import { getPortfolio } from "../api";

function Portfolio() {
    const [portfolio, setPortfolio] = useState({
        holdings: [],
        totalInvestment: 0,
        totalValue: 0,
        totalProfit: 0,
    });
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isCurrentRequest = true;

        getPortfolio()
            .then((data) => {
                if (isCurrentRequest) {
                    setPortfolio(data);
                    setStatus("succeeded");
                }
            })
            .catch((requestError) => {
                if (isCurrentRequest) {
                    setError(requestError.message || "Unable to load portfolio.");
                    setStatus("failed");
                }
            });

        return () => {
            isCurrentRequest = false;
        };
    }, [retryCount]);

    return (
        <div>

            <div className="page-header">
                <h1>My Portfolio</h1>
                <p>
                    Track your investments and profit/loss.
                </p>
            </div>

            {status === "loading" && (
                <div className="stocks-state" role="status">
                    <span className="transaction-spinner" />
                    <strong>Loading your portfolio</strong>
                </div>
            )}

            {status === "failed" && (
                <div className="stocks-state stocks-state-error" role="alert">
                    <strong>We couldn’t load your portfolio</strong>
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
                    <div className="portfolio-summary">
                        <div className="stat-card">
                            <span>Total Investment</span>
                            <h2>₹{portfolio.totalInvestment.toLocaleString("en-IN")}</h2>
                        </div>

                        <div className="stat-card">
                            <span>Current Value</span>
                            <h2>₹{portfolio.totalValue.toLocaleString("en-IN")}</h2>
                        </div>

                        <div className="stat-card">
                            <span>Total Profit / Loss</span>
                            <h2 className={portfolio.totalProfit >= 0 ? "positive" : "negative"}>
                                {portfolio.totalProfit >= 0 ? "+" : "-"}₹
                                {Math.abs(portfolio.totalProfit).toLocaleString("en-IN")}
                            </h2>
                        </div>

                    </div>

                    <PortfolioTable holdings={portfolio.holdings} />
                </>
            )}

        </div>
    );
}

export default Portfolio;