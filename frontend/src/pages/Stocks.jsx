import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import StockCard from "../components/StockCard";
import { getStocks } from "../api";

function Stocks() {
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [descending, setDescending] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getStocks()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid stock list.");
        }
        if (isMounted) {
          setStocks(data);
          setStatus("succeeded");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Unable to load stocks.");
          setStatus("failed");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStocks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return stocks
      .filter((stock) =>
        `${stock.name} ${stock.symbol}`.toLowerCase().includes(query)
      )
      .sort((left, right) =>
        (Number(left.price) - Number(right.price)) * (descending ? -1 : 1)
      );
  }, [descending, search, stocks]);

  const gainers = stocks.filter((stock) => Number(stock.change) > 0).length;
  const decliners = stocks.filter((stock) => Number(stock.change) < 0).length;

  const retryLoad = () => {
    setStatus("loading");
    setError("");
    getStocks()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid stock list.");
        }
        setStocks(data);
        setStatus("succeeded");
      })
      .catch((requestError) => {
        setError(requestError.message || "Unable to load stocks.");
        setStatus("failed");
      });
  };

  return (
    <section className="stocks-page">
      <div className="page-header stocks-heading">
        <div>
          <span className="eyebrow-label">Market directory</span>
          <h1>Explore stocks</h1>
          <p>Market prices and daily movements at a glance.</p>
        </div>
        <div className="stocks-heading-mark" aria-hidden="true">
          <TrendingUp size={24} />
          <span>Market overview</span>
        </div>
      </div>

      <div className="stats-grid stocks-stats">
        <article className="stat-card stocks-stat stocks-stat-blue">
          <span className="stocks-stat-icon"><Search size={18} /></span>
          <div>
            <span>Available stocks</span>
            <h2>{stocks.length.toLocaleString("en-IN")}</h2>
            <small>Companies in the directory</small>
          </div>
        </article>
        <article className="stat-card stocks-stat stocks-stat-green">
          <span className="stocks-stat-icon"><TrendingUp size={18} /></span>
          <div>
            <span>Market gainers</span>
            <h2>{gainers.toLocaleString("en-IN")}</h2>
            <small>Positive daily movement</small>
          </div>
        </article>
        <article className="stat-card stocks-stat stocks-stat-red">
          <span className="stocks-stat-icon"><TrendingDown size={18} /></span>
          <div>
            <span>Market decliners</span>
            <h2>{decliners.toLocaleString("en-IN")}</h2>
            <small>Negative daily movement</small>
          </div>
        </article>
      </div>

      <div className="stocks-catalog">
        <div className="stocks-toolbar">
          <div>
            <h2>Stock list</h2>
            <p>Search by company name or ticker symbol.</p>
          </div>
          <div className="stocks-controls">
            <label className="search-box stocks-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search stocks"
                placeholder="Search stocks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <button
              className="stocks-sort"
              type="button"
              onClick={() => setDescending((current) => !current)}
              aria-label={`Sort price ${descending ? "low to high" : "high to low"}`}
            >
              {descending ? <ArrowDownWideNarrow size={16} /> : <ArrowUpNarrowWide size={16} />}
              Price {descending ? "high to low" : "low to high"}
            </button>
          </div>
        </div>

        {status === "loading" && (
          <div className="stocks-state" role="status">
            <span className="transaction-spinner" />
            <strong>Loading market data</strong>
          </div>
        )}

        {status === "failed" && (
          <div className="stocks-state stocks-state-error" role="alert">
            <strong>We couldn’t load the stock list</strong>
            <p>{error}</p>
            <button className="secondary-button" type="button" onClick={retryLoad}>
              Try again
            </button>
          </div>
        )}

        {status === "succeeded" && filteredStocks.length === 0 && (
          <div className="stocks-state">
            <span className="stocks-empty-icon"><Search size={20} /></span>
            <strong>No stocks found</strong>
            <p>Try another company name or ticker symbol.</p>
            {search && (
              <button className="secondary-button" type="button" onClick={() => setSearch("")}>
                Clear search
              </button>
            )}
          </div>
        )}

        {status === "succeeded" && filteredStocks.length > 0 && (
          <div className="stock-grid">
            {filteredStocks.map((stock) => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Stocks;