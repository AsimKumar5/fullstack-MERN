import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  CheckCheck,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { getStocks, getTransactions } from "../api";
import { useSelector } from "react-redux";
import {
  announceReadNotificationsChange,
  getNotificationItems,
  loadReadNotifications,
  READ_NOTIFICATIONS_KEY,
} from "../utils/notifications";

function Notifications() {
  const token = useSelector((state) => state.auth.token);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(loadReadNotifications);
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    Promise.all([getStocks(), token ? getTransactions() : Promise.resolve([])])
      .then(([stocks, transactions]) => {
        if (!Array.isArray(stocks) || !Array.isArray(transactions)) {
          throw new Error("The server returned invalid notification data.");
        }
        if (isCurrentRequest) {
          setNotifications(getNotificationItems(stocks, transactions));
          setStatus("succeeded");
        }
      })
      .catch((requestError) => {
        if (isCurrentRequest) {
          setError(requestError.message || "Unable to load notifications.");
          setStatus("failed");
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [retryCount, token]);

  const unreadIds = useMemo(
    () => notifications.filter((item) => !readIds.includes(item.id)).map((item) => item.id),
    [notifications, readIds],
  );
  const visibleNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !readIds.includes(item.id));
    }
    if (filter === "market" || filter === "activity") {
      return notifications.filter((item) => item.category === filter);
    }
    return notifications;
  }, [filter, notifications, readIds]);

  const persistReadIds = useCallback((nextReadIds) => {
    setReadIds(nextReadIds);
    try {
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(nextReadIds));
      announceReadNotificationsChange();
    } catch (storageError) {
      console.error("Unable to save notification read status:", storageError);
    }
  }, []);

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      persistReadIds([...readIds, id]);
    }
  };

  const markAllAsRead = () => {
    persistReadIds([...new Set([...readIds, ...unreadIds])]);
  };

  return (
    <section className="notifications-page">
      <header className="page-header notifications-heading">
        <div>
          <span className="eyebrow-label">Your updates</span>
          <h1>Notifications</h1>
          <p>Market movements and recent activity from your account.</p>
        </div>
        <button
          className="secondary-button notifications-mark-all"
          type="button"
          onClick={markAllAsRead}
          disabled={status !== "succeeded" || unreadIds.length === 0}
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </header>

      <div className="notifications-summary">
        <div className="notifications-summary-icon">
          <Bell size={20} />
          {unreadIds.length > 0 && <span>{unreadIds.length}</span>}
        </div>
        <div>
          <strong>{unreadIds.length ? `${unreadIds.length} unread updates` : "You’re all caught up"}</strong>
          <p>{notifications.length} updates available</p>
        </div>
      </div>

      <nav className="notifications-filters" aria-label="Filter notifications">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: "Unread" },
          { id: "market", label: "Market" },
          { id: "activity", label: "Account activity" },
        ].map((option) => (
          <button
            key={option.id}
            className={filter === option.id ? "active" : ""}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
          >
            {option.label}
            {option.id === "unread" && unreadIds.length > 0 && (
              <span className="notifications-filter-count">{unreadIds.length}</span>
            )}
          </button>
        ))}
      </nav>

      {status === "loading" && (
        <div className="stocks-state" role="status">
          <span className="transaction-spinner" />
          <strong>Loading your notifications</strong>
        </div>
      )}

      {status === "failed" && (
        <div className="stocks-state stocks-state-error" role="alert">
          <strong>We couldn’t load notifications</strong>
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
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {status === "succeeded" && visibleNotifications.length > 0 && (
        <div className="notifications-list">
          {visibleNotifications.map((item) => {
            const isRead = readIds.includes(item.id);
            const isMarket = item.category === "market";
            const isPositive = item.change >= 0;

            return (
              <article
                className={`notification-item${isRead ? " is-read" : " is-unread"}`}
                key={item.id}
              >
                <span className={`notification-item-icon ${isMarket ? (isPositive ? "market-up" : "market-down") : "account-activity"}`}>
                  {isMarket
                    ? (isPositive ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />)
                    : <ShoppingBag size={17} />}
                </span>
                <div className="notification-item-content">
                  <div className="notification-item-heading">
                    <strong>{item.title}</strong>
                    {!isRead && <span className="notification-unread-dot" aria-label="Unread" />}
                  </div>
                  <p>{item.description}</p>
                  <span className="notification-item-meta">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Current market catalog"}
                    {item.status && ` · ${item.status}`}
                  </span>
                </div>
                {!isRead && (
                  <button
                    className="notification-read-button"
                    type="button"
                    onClick={() => markAsRead(item.id)}
                    aria-label={`Mark as read: ${item.title}`}
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {status === "succeeded" && visibleNotifications.length === 0 && (
        <div className="notifications-empty">
          <span><Bell size={21} /></span>
          <strong>{filter === "unread" ? "No unread notifications" : "No notifications yet"}</strong>
          <p>
            {filter === "unread"
              ? "You’ve read all your updates."
              : "Market updates and account activity will appear here."}
          </p>
        </div>
      )}
    </section>
  );
}

export default Notifications;
