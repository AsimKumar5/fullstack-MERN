import { useEffect, useState } from "react";
import PortfolioTable from "../components/PortfolioTable";
import { getPortfolio } from "../api";

function Portfolio() {

    const [portfolio, setPortfolio] = useState({ holdings: [], investment: 0, currentValue: 0, profit: 0 });

    useEffect(() => {
        getPortfolio().then(setPortfolio).catch(() => {});
    }, []);

    return (
        <div>

            <div className="page-header">
                <h1>My Portfolio</h1>
                <p>
                    Track your investments and profit/loss.
                </p>
            </div>

            <div className="portfolio-summary">

                <div className="stat-card">
                    <span>Total Investment</span>
                    <h2>₹{(portfolio.totalInvestment || 0).toLocaleString("en-IN")}</h2>
                </div>

                <div className="stat-card">
                    <span>Current Value</span>
                    <h2>₹{(portfolio.totalValue || 0).toLocaleString("en-IN")}</h2>
                </div>

                <div className="stat-card">
                    <span>Total Profit</span>
                    <h2 className="positive">
                        +₹{(portfolio.totalProfit || 0).toLocaleString("en-IN")}
                    </h2>
                </div>

            </div>

            <PortfolioTable
                holdings={portfolio.holdings}
            />

        </div>
    );
}

export default Portfolio;