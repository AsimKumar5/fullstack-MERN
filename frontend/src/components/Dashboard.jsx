import {
  Wallet,
  TrendingUp,
  DollarSign,
  Activity
} from "lucide-react";



import PriceChart from "../components/PriceChart";
import StockCard from "../components/StockCard";

function Dashboard() {

  const topStocks = [
    {
      name: "Tata Consultancy Services",
      symbol: "TCS",
      price: 3820,
      change: 2.45
    },
    {
      name: "Infosys",
      symbol: "INFY",
      price: 1650,
      change: 1.82
    },
    {
      name: "Reliance Industries",
      symbol: "RELIANCE",
      price: 1450,
      change: -0.75
    }
  ];

  return (
    <div className="dashboard">

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Monitor your investments and market performance.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <Wallet />
          </div>

          <div>
            <span>Portfolio Value</span>
            <h2>₹1,25,450</h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <DollarSign />
          </div>

          <div>
            <span>Total Investment</span>
            <h2>₹1,10,000</h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <TrendingUp />
          </div>

          <div>
            <span>Total Profit</span>
            <h2 className="positive">
              +₹15,450
            </h2>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <Activity />
          </div>

          <div>
            <span>Today's Change</span>
            <h2 className="positive">
              +2.45%
            </h2>
          </div>

        </div>

      </div>

      {/* Chart */}

      <div className="dashboard-section">

        <div className="section-header">
          <h2>Portfolio Performance</h2>

          <select>
            <option>1 Week</option>
            <option>1 Month</option>
            <option>6 Months</option>
            <option>1 Year</option>
          </select>
        </div>

        <PriceChart />

      </div>

      {/* Top stocks */}

      <div className="dashboard-section">

        <div className="section-header">
          <h2>Popular Stocks</h2>
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

    </div>
  );
}

export default Dashboard;