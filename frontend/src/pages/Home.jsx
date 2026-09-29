import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet
} from "lucide-react";

const featureList = [
  {
    icon: <BarChart3 size={22} />,
    title: "Live market insights",
    text: "Track price movement, portfolio trends, and stock momentum in one clear dashboard."
  },
  {
    icon: <Wallet size={22} />,
    title: "Clear portfolio view",
    text: "Monitor your holdings, cash flow, and gains without digging through spreadsheets."
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Secure investing",
    text: "Stay confident with a clean, reliable experience built for everyday investors."
  }
];

const stats = [
  { value: "₹1.2L+", label: "Portfolio tracked" },
  { value: "24/7", label: "Market updates" },
  { value: "4.9/5", label: "Investor rating" }
];

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-badge">
            <Sparkles size={16} />
            Smarter investing for modern traders
          </span>

          <h1>Grow your wealth with confidence.</h1>

          <p>
            Discover opportunities, track performance, and build a portfolio that works
            for your goals with a transparent stock dashboard designed for clarity.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary-btn">
              Register Now
              <ArrowRight size={18} />
            </Link>

            <Link to="/login" className="secondary-btn">
              Sign in
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map((item) => (
              <div className="mini-stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Portfolio preview">
          <div className="glass-card main-card">
            <div className="card-header">
              <span>Portfolio</span>
              <span className="positive-pill">+12.4%</span>
            </div>

            <div className="chart-bars" aria-hidden="true">
              <span style={{ height: "28%" }} />
              <span style={{ height: "38%" }} />
              <span style={{ height: "60%" }} />
              <span style={{ height: "48%" }} />
              <span style={{ height: "82%" }} />
              <span style={{ height: "100%" }} />
              <span style={{ height: "90%" }} />
            </div>

            <div className="portfolio-summary">
              <div>
                <small>Balance</small>
                <strong>₹1,25,450</strong>
              </div>
              <div>
                <small>Change</small>
                <strong className="positive">+₹5,450</strong>
              </div>
            </div>
          </div>

          <div className="glass-card floating-card top-card">
            <TrendingUp size={18} />
            <div>
              <small>Top gainers</small>
              <strong>+8.2%</strong>
            </div>
          </div>

          <div className="glass-card floating-card bottom-card">
            <span className="dot green" />
            <div>
              <small>Market status</small>
              <strong>Open</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading">
          <span>Why investors choose us</span>
          <h2>Everything you need to manage your investments.</h2>
        </div>

        <div className="feature-grid">
          {featureList.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span>Start today</span>
          <h2>Turn market data into smarter decisions.</h2>
        </div>
      </section>
    </div>
  );
}

export default Home;
