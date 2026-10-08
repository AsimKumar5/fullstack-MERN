import { Bell, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getStocks, getTransactions } from "../api";
import { fetchCurrentUser } from "../store/userSlice";
import {
  getNotificationItems,
  loadReadNotifications,
} from "../utils/notifications";

function Navbar() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { profile } = useSelector((state) => state.user);
  const [notificationBadge, setNotificationBadge] = useState({ token: null, count: 0 });
  const unreadCount =
    token && notificationBadge.token === token ? notificationBadge.count : 0;

  useEffect(() => {
    if (token && !profile) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, profile]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isCurrentRequest = true;
    let notificationIds = [];
    const syncUnreadCount = () => {
      const readIds = loadReadNotifications();
      setNotificationBadge({
        token,
        count: notificationIds.filter((id) => !readIds.includes(id)).length,
      });
    };
    const updateUnreadCount = () => {
      if (!isCurrentRequest) return;
      Promise.all([getStocks(), getTransactions()])
        .then(([stocks, transactions]) => {
          if (!Array.isArray(stocks) || !Array.isArray(transactions)) {
            throw new Error("The server returned invalid notification data.");
          }
          if (isCurrentRequest) {
            const items = getNotificationItems(stocks, transactions);
            notificationIds = items.map((item) => item.id);
            syncUnreadCount();
          }
        })
        .catch((error) => {
          if (isCurrentRequest && error.status !== 401) {
            console.error("Unable to update notification badge:", error);
          }
        });
    };
    const handleReadStatusChange = () => {
      syncUnreadCount();
    };
    const handleStorageChange = (event) => {
      if (event.key === "readNotifications") {
        syncUnreadCount();
      }
    };

    updateUnreadCount();
    window.addEventListener("readNotificationsChange", handleReadStatusChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      isCurrentRequest = false;
      window.removeEventListener("readNotificationsChange", handleReadStatusChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  return (
    <header className="navbar">

      <div className="navbar-logo">
        📈 StockMarket
      </div>

      <div className="navbar-right">

        <div className="market-status">
          <span>●</span>
          Market Open
        </div>

        <Link
          to="/notifications"
          className="navbar-notifications"
          aria-label={unreadCount ? `View notifications, ${unreadCount} unread` : "View notifications"}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="navbar-notifications-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
        
        <Link to="/profile" className="user-profile" aria-label="View user profile">
          <UserCircle size={28} />
          <span>{profile?.name || "Investor"}</span>
        </Link>

      </div>

    </header>
  );
}

export default Navbar;