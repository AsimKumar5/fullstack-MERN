import { useEffect, useState } from "react";
import {
  Activity,
  Building2,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  createAdminStock,
  getAdminOverview,
  updateAdminStock,
  updateAdminUserStatus,
} from "../api";

const emptyOverview = {
  summary: { users: 0, stocks: 0, transactions: 0 },
  users: [],
  stocks: [],
  transactions: [],
};

const emptyStockForm = { name: "", symbol: "", price: "", change: "" };

function AdminPanel() {
  const [overview, setOverview] = useState(emptyOverview);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [stockForm, setStockForm] = useState(emptyStockForm);
  const [editingSymbol, setEditingSymbol] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    getAdminOverview()
      .then((data) => {
        if (isCurrentRequest) {
          setOverview({ ...emptyOverview, ...data });
          setStatus("succeeded");
        }
      })
      .catch((requestError) => {
        if (isCurrentRequest) {
          setError(requestError.message || "Unable to load admin panel.");
          setStatus("failed");
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [retryCount]);

  const refreshOverview = () => {
    setError("");
    setStatus("loading");
    setRetryCount((current) => current + 1);
  };

  const handleUserStatus = async (user) => {
    setUpdatingUserId(user.id);
    setError("");
    setNotice("");
    try {
      const result = await updateAdminUserStatus(user.id, !user.isActive);
      setNotice(result.message);
      refreshOverview();
    } catch (requestError) {
      setError(requestError.message || "Unable to update user.");
    } finally {
      setUpdatingUserId("");
    }
  };

  const handleStockFormChange = (event) => {
    setStockForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const editStock = (stock) => {
    setEditingSymbol(stock.symbol);
    setStockForm({
      name: stock.name,
      symbol: stock.symbol,
      price: String(stock.price),
      change: String(stock.change),
    });
    setActiveTab("stocks");
    setError("");
    setNotice("");
  };

  const cancelStockEdit = () => {
    setEditingSymbol("");
    setStockForm(emptyStockForm);
  };

  const handleStockSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      name: stockForm.name.trim(),
      price: Number(stockForm.price),
      change: Number(stockForm.change),
    };

    try {
      const result = editingSymbol
        ? await updateAdminStock(editingSymbol, payload)
        : await createAdminStock({ ...payload, symbol: stockForm.symbol.trim() });
      setNotice(result.message);
      cancelStockEdit();
      refreshOverview();
    } catch (requestError) {
      setError(requestError.message || "Unable to save stock.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={16} /> },
    { id: "users", label: "Users", icon: <Users size={16} /> },
    { id: "stocks", label: "Stocks", icon: <Building2 size={16} /> },
    { id: "transactions", label: "Transactions", icon: <Activity size={16} /> },
  ];

  return (
    <section className="admin-page">
      <header className="page-header admin-heading">
        <div>
          <span className="eyebrow-label">Administration</span>
          <h1>Admin panel</h1>
          <p>Manage registered accounts, the market catalog, and transaction activity.</p>
        </div>
        <span className="admin-secure-label"><ShieldCheck size={16} /> Protected access</span>
      </header>

      {error && (
        <div className="stocks-state stocks-state-error admin-alert" role="alert">
          <strong>{status === "failed" ? "Admin panel unavailable" : "Action failed"}</strong>
          <p>{error}</p>
          {status === "failed" && (
            <button className="secondary-button" type="button" onClick={refreshOverview}>
              <RefreshCw size={15} /> Try again
            </button>
          )}
        </div>
      )}
      {notice && <div className="admin-notice" role="status">{notice}</div>}

      {status === "loading" && (
        <div className="stocks-state" role="status">
          <span className="transaction-spinner" />
          <strong>Loading admin data</strong>
        </div>
      )}

      {status === "succeeded" && (
        <>
          <div className="admin-summary">
            <article className="admin-summary-card">
              <span className="admin-summary-icon users"><Users size={18} /></span>
              <div><small>Registered users</small><strong>{overview.summary.users}</strong></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon stocks"><Building2 size={18} /></span>
              <div><small>Stock listings</small><strong>{overview.summary.stocks}</strong></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon activity"><Activity size={18} /></span>
              <div><small>Total transactions</small><strong>{overview.summary.transactions}</strong></div>
            </article>
          </div>

          <nav className="admin-tabs" aria-label="Admin sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </nav>

          {activeTab === "overview" && (
            <div className="admin-overview-grid">
              <article className="admin-panel-card">
                <div className="admin-card-heading">
                  <div><h2>Recent users</h2><p>Latest registered accounts</p></div>
                  <button type="button" onClick={() => setActiveTab("users")}>View all</button>
                </div>
                {overview.users.slice(0, 5).map((user) => (
                  <div className="admin-overview-row" key={user.id}>
                    <span className="admin-user-avatar">{user.name?.slice(0, 1).toUpperCase() || "U"}</span>
                    <div><strong>{user.name}</strong><small>{user.email}</small></div>
                    <span className={`admin-status ${user.isActive ? "enabled" : "disabled"}`}>
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                ))}
                {overview.users.length === 0 && <p className="admin-empty">No registered users.</p>}
              </article>
              <article className="admin-panel-card">
                <div className="admin-card-heading">
                  <div><h2>Recent transactions</h2><p>Latest account activity</p></div>
                  <button type="button" onClick={() => setActiveTab("transactions")}>View all</button>
                </div>
                {overview.transactions.slice(0, 5).map((transaction) => (
                  <div className="admin-overview-row" key={transaction.id}>
                    <span className={`admin-transaction-type ${transaction.type === "BUY" ? "buy" : "sell"}`}>
                      {transaction.type}
                    </span>
                    <div>
                      <strong>{transaction.symbol} · {transaction.quantity} shares</strong>
                      <small>{transaction.user?.email || "User unavailable"}</small>
                    </div>
                    <strong className="admin-transaction-amount">
                      ₹{Number(transaction.amount).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
                {overview.transactions.length === 0 && <p className="admin-empty">No transactions yet.</p>}
              </article>
            </div>
          )}

          {activeTab === "users" && (
            <article className="admin-panel-card admin-table-panel">
              <div className="admin-card-heading">
                <div><h2>User management</h2><p>Activate or deactivate account access.</p></div>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead><tr><th>User</th><th>Email</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {overview.users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                        <td><span className={`admin-status ${user.isActive ? "enabled" : "disabled"}`}>{user.isActive ? "Active" : "Disabled"}</span></td>
                        <td>
                          <button
                            className={`admin-action-button ${user.isActive ? "deactivate" : "activate"}`}
                            type="button"
                            disabled={user.isAdmin || updatingUserId === user.id}
                            onClick={() => handleUserStatus(user)}
                            title={user.isAdmin ? "Configured admin account cannot be deactivated" : ""}
                          >
                            {updatingUserId === user.id ? "Saving..." : user.isAdmin ? "Admin" : user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {overview.users.length === 0 && <tr><td colSpan="5">No registered users.</td></tr>}
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {activeTab === "stocks" && (
            <div className="admin-stock-layout">
              <article className="admin-panel-card admin-stock-form-card">
                <div className="admin-card-heading">
                  <div>
                    <h2>{editingSymbol ? `Edit ${editingSymbol}` : "Add stock"}</h2>
                    <p>{editingSymbol ? "Update catalog price and daily change." : "Add a new listing to the stock catalog."}</p>
                  </div>
                </div>
                <form className="admin-stock-form" onSubmit={handleStockSubmit}>
                  <label>
                    Company name
                    <input name="name" value={stockForm.name} onChange={handleStockFormChange} required maxLength="120" />
                  </label>
                  <label>
                    Ticker symbol
                    <input
                      name="symbol"
                      value={stockForm.symbol}
                      onChange={handleStockFormChange}
                      required
                      disabled={Boolean(editingSymbol)}
                      maxLength="15"
                      pattern="[A-Za-z0-9.-]+"
                      title="Use letters, numbers, periods, or hyphens"
                    />
                  </label>
                  <div className="admin-stock-numeric-fields">
                    <label>
                      Price (₹)
                      <input name="price" type="number" value={stockForm.price} onChange={handleStockFormChange} min="0" step="0.01" required />
                    </label>
                    <label>
                      Daily change (%)
                      <input name="change" type="number" value={stockForm.change} onChange={handleStockFormChange} step="0.01" required />
                    </label>
                  </div>
                  <div className="admin-form-actions">
                    <button className="primary-button" type="submit" disabled={saving}>
                      {editingSymbol ? <Pencil size={15} /> : <Plus size={16} />}
                      {saving ? "Saving..." : editingSymbol ? "Save changes" : "Add stock"}
                    </button>
                    {editingSymbol && (
                      <button className="secondary-button" type="button" onClick={cancelStockEdit}>Cancel</button>
                    )}
                  </div>
                </form>
              </article>

              <article className="admin-panel-card admin-table-panel">
                <div className="admin-card-heading">
                  <div><h2>Stock catalog</h2><p>{overview.stocks.length} listings</p></div>
                </div>
                <div className="table-container">
                  <table className="admin-table">
                    <thead><tr><th>Company</th><th>Symbol</th><th>Price</th><th>Change</th><th>Action</th></tr></thead>
                    <tbody>
                      {overview.stocks.map((stock) => (
                        <tr key={stock.id}>
                          <td>{stock.name}</td>
                          <td><strong>{stock.symbol}</strong></td>
                          <td>₹{Number(stock.price).toLocaleString("en-IN")}</td>
                          <td className={stock.change >= 0 ? "positive" : "negative"}>
                            {stock.change > 0 ? "+" : ""}{Number(stock.change).toFixed(2)}%
                          </td>
                          <td><button className="admin-action-button edit" type="button" onClick={() => editStock(stock)}>Edit</button></td>
                        </tr>
                      ))}
                      {overview.stocks.length === 0 && <tr><td colSpan="5">No stock listings.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
          )}

          {activeTab === "transactions" && (
            <article className="admin-panel-card admin-table-panel">
              <div className="admin-card-heading">
                <div><h2>Transaction history</h2><p>Showing the latest {overview.transactions.length} transactions.</p></div>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead><tr><th>Date</th><th>User</th><th>Stock</th><th>Type</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead>
                  <tbody>
                    {overview.transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{new Date(transaction.date).toLocaleString()}</td>
                        <td>{transaction.user?.email || "User unavailable"}</td>
                        <td>{transaction.symbol}</td>
                        <td><span className={`admin-transaction-type ${transaction.type === "BUY" ? "buy" : "sell"}`}>{transaction.type}</span></td>
                        <td>{transaction.quantity}</td>
                        <td>₹{Number(transaction.price).toLocaleString("en-IN")}</td>
                        <td>₹{Number(transaction.amount).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                    {overview.transactions.length === 0 && <tr><td colSpan="7">No transactions yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </article>
          )}
        </>
      )}
    </section>
  );
}

export default AdminPanel;
