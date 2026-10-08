import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Receipt, Search, Wallet } from "lucide-react";
import { getTransactions } from "../api";

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

function Transactions() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const data = await getTransactions();
      if (!Array.isArray(data)) {
        throw new Error("The server returned an invalid transaction list.");
      }
      setTransactions(data);
      setStatus("succeeded");
    } catch (requestError) {
      setError(requestError.message || "Unable to load transactions.");
      setStatus("failed");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getTransactions()
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid transaction list.");
        }
        if (isMounted) {
          setTransactions(data);
          setStatus("succeeded");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Unable to load transactions.");
          setStatus("failed");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesType = filter === "ALL" || transaction.type === filter;
      const matchesQuery =
        !query ||
        [transaction.stock, transaction.symbol, transaction.company]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query));
      return matchesType && matchesQuery;
    });
  }, [filter, search, transactions]);

  const summary = useMemo(
    () => ({
      total: transactions.length,
      buys: transactions.filter((transaction) => transaction.type === "BUY").length,
      sells: transactions.filter((transaction) => transaction.type === "SELL").length,
      value: transactions.reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      ),
    }),
    [transactions],
  );

  return (
    <section className="transactions-page">
      <div className="page-header transactions-heading">
        <div>
          <span className="eyebrow-label">Activity center</span>
          <h1>Transactions</h1>
          <p>Review your trading activity and order history.</p>
        </div>
        <div className="transaction-heading-icon" aria-hidden="true">
          <Receipt size={23} />
        </div>
      </div>

      <div className="stats-grid transactions-stats">
        <article className="stat-card transaction-stat transaction-stat-blue">
          <span className="transaction-stat-icon"><Receipt size={19} /></span>
          <div>
            <span>Total transactions</span>
            <h2>{summary.total.toLocaleString("en-IN")}</h2>
            <small>Orders in your history</small>
          </div>
        </article>
        <article className="stat-card transaction-stat transaction-stat-green">
          <span className="transaction-stat-icon"><ArrowDownLeft size={19} /></span>
          <div>
            <span>Buy orders</span>
            <h2>{summary.buys.toLocaleString("en-IN")}</h2>
            <small>Completed purchases</small>
          </div>
        </article>
        <article className="stat-card transaction-stat transaction-stat-rose">
          <span className="transaction-stat-icon"><ArrowUpRight size={19} /></span>
          <div>
            <span>Sell orders</span>
            <h2>{summary.sells.toLocaleString("en-IN")}</h2>
            <small>Completed sales</small>
          </div>
        </article>
        <article className="stat-card transaction-stat transaction-stat-violet">
          <span className="transaction-stat-icon"><Wallet size={19} /></span>
          <div>
            <span>Total trading value</span>
            <h2>{formatMoney(summary.value)}</h2>
            <small>Across recorded orders</small>
          </div>
        </article>
      </div>

      <div className="transaction-history">
        <div className="transaction-toolbar">
          <div>
            <h2>Order history</h2>
            <p>Search and filter your completed transactions.</p>
          </div>
          <label className="transaction-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search transactions"
              placeholder="Search stock or company"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="transaction-filters" role="group" aria-label="Filter transactions">
          {[
            ["ALL", "All activity"],
            ["BUY", "Buys"],
            ["SELL", "Sells"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`transaction-filter ${filter === value ? "active" : ""}`}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
              <span>
                {value === "ALL"
                  ? summary.total
                  : value === "BUY"
                    ? summary.buys
                    : summary.sells}
              </span>
            </button>
          ))}
          <span className="transaction-result-count">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? "result" : "results"}
          </span>
        </div>

        {status === "loading" && (
          <div className="transaction-state" role="status">
            <span className="transaction-spinner" />
            <strong>Loading your transactions</strong>
            <p>Getting your latest activity…</p>
          </div>
        )}

        {status === "failed" && (
          <div className="transaction-state transaction-state-error" role="alert">
            <strong>We couldn’t load your transactions</strong>
            <p>{error}</p>
            <button className="secondary-button" type="button" onClick={loadTransactions}>
              Try again
            </button>
          </div>
        )}

        {status === "succeeded" && filteredTransactions.length === 0 && (
          <div className="transaction-state">
            <span className="transaction-empty-icon"><Receipt size={23} /></span>
            <strong>
              {transactions.length === 0 ? "No transactions yet" : "No matching transactions"}
            </strong>
            <p>
              {transactions.length === 0
                ? "Your completed trades will appear here when they’re available."
                : "Try another search term or change the transaction filter."}
            </p>
            {transactions.length > 0 && (search || filter !== "ALL") && (
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("ALL");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {status === "succeeded" && filteredTransactions.length > 0 && (
          <div className="table-container transaction-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>
                      <span className="transaction-stock">
                        <span className="transaction-stock-avatar">
                          {(transaction.symbol || transaction.stock || "?").slice(0, 2)}
                        </span>
                        <span>
                          <strong>{transaction.symbol || transaction.stock || "Unknown"}</strong>
                          <small>{transaction.company || "Company unavailable"}</small>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className={`transaction-type ${transaction.type === "BUY" ? "buy" : "sell"}`}>
                        {transaction.type === "BUY"
                          ? <ArrowDownLeft size={14} />
                          : <ArrowUpRight size={14} />}
                        {transaction.type || "—"}
                      </span>
                    </td>
                    <td>{Number(transaction.quantity || 0).toLocaleString("en-IN")}</td>
                    <td>{formatMoney(transaction.price)}</td>
                    <td className="transaction-total">{formatMoney(transaction.amount)}</td>
                    <td><span className="transaction-complete"><span />{transaction.status || "Completed"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Transactions;
