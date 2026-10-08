import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getStock } from "../api";

const formatMoney = (value) =>
  `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function StockDetails() {
  const { symbol = "" } = useParams();
  const [result, setResult] = useState({
    stock: null,
    loadedSymbol: "",
    error: "",
  });
  const [retryCount, setRetryCount] = useState(0);
  const normalizedSymbol = symbol.toUpperCase();
  const isLoading = result.loadedSymbol !== normalizedSymbol;
  const stock = isLoading ? null : result.stock;
  const error = isLoading ? "" : result.error;

  useEffect(() => {
    let isCurrentRequest = true;

    getStock(normalizedSymbol)
      .then((data) => {
        if (isCurrentRequest) {
          setResult({ stock: data, loadedSymbol: normalizedSymbol, error: "" });
        }
      })
      .catch((requestError) => {
        if (isCurrentRequest) {
          setResult({
            stock: null,
            loadedSymbol: normalizedSymbol,
            error: requestError.message || "Unable to load stock details.",
          });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [normalizedSymbol, retryCount]);

  const isPositive = stock?.change >= 0;

  return (
    <section className="stock-detail-page">
      <Link className="stock-detail-back" to="/stocks">
        <ArrowLeft size={16} />
        Back to stocks
      </Link>

      {isLoading && (
        <div className="stock-detail-state" role="status">
          <span className="transaction-spinner" />
          <strong>Loading {normalizedSymbol} details</strong>
          <p>Fetching the latest available stock information.</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="stock-detail-state stock-detail-error" role="alert">
          <span className="stock-detail-state-icon"><RefreshCw size={20} /></span>
          <strong>Couldn’t load {normalizedSymbol}</strong>
          <p>{error}</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setResult({ stock: null, loadedSymbol: "", error: "" });
              setRetryCount((current) => current + 1);
            }}
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && stock && (
        <>
          <header className="stock-detail-hero">
            <div className="stock-detail-company">
              <span className="stock-detail-monogram">{stock.symbol.slice(0, 2)}</span>
              <div>
                <span className="eyebrow-label">Stock overview</span>
                <h1>{stock.name}</h1>
                <span className="stock-detail-symbol">{stock.symbol}</span>
              </div>
            </div>
            <div className={`stock-detail-movement ${isPositive ? "positive" : "negative"}`}>
              {isPositive ? <TrendingUp size={17} /> : <TrendingDown size={17} />}
              <span>{isPositive ? "+" : ""}{Number(stock.change).toFixed(2)}%</span>
              <small>today</small>
            </div>
          </header>

          <div className="stock-detail-grid">
            <article className="stock-detail-price-card">
              <span className="stock-detail-label">Current price</span>
              <strong>{formatMoney(stock.price)}</strong>
              <span className={`stock-detail-change ${isPositive ? "positive" : "negative"}`}>
                {isPositive ? "+" : ""}{Number(stock.change).toFixed(2)}% daily move
              </span>
              <div className="stock-detail-price-orbit"><ArrowUpRight size={23} /></div>
            </article>

            <article className="stock-detail-info-card">
              <span className="stock-detail-info-icon"><Building2 size={18} /></span>
              <span className="stock-detail-label">Company</span>
              <strong>{stock.name}</strong>
              <small>Listed symbol: {stock.symbol}</small>
            </article>

            <article className="stock-detail-info-card">
              <span className={`stock-detail-info-icon ${isPositive ? "up" : "down"}`}>
                {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </span>
              <span className="stock-detail-label">Daily movement</span>
              <strong className={isPositive ? "positive" : "negative"}>
                {isPositive ? "+" : ""}{Number(stock.change).toFixed(2)}%
              </strong>
              <small>Change reported by the market catalog</small>
            </article>
          </div>

          <section className="stock-detail-note">
            <span className="stock-detail-note-mark">i</span>
            <p>
              This page displays the latest price and daily change available in the
              stock catalog. Historical price data is not currently provided.
            </p>
          </section>
        </>
      )}
    </section>
  );
}

export default StockDetails;
