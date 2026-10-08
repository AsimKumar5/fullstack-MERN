export const READ_NOTIFICATIONS_KEY = "readNotifications";

export const loadReadNotifications = () => {
  try {
    const saved = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load notification read status:", error);
    return [];
  }
};

export const getNotificationItems = (stocks, transactions) => {
  const marketItems = stocks.map((stock) => ({
    id: `market:${stock.symbol}:${stock.change}`,
    category: "market",
    title: `${stock.name} ${Number(stock.change) >= 0 ? "gained" : "declined"} ${Math.abs(Number(stock.change)).toFixed(2)}%`,
    description: `${stock.symbol} is currently listed at ₹${Number(stock.price).toLocaleString("en-IN")}.`,
    timestamp: null,
    change: Number(stock.change),
  }));
  const transactionItems = transactions.map((transaction) => ({
    id: `transaction:${transaction.id}`,
    category: "activity",
    title: `${transaction.type === "BUY" ? "Buy" : "Sell"} order completed`,
    description: `${transaction.quantity} ${transaction.symbol} share${transaction.quantity === 1 ? "" : "s"} at ₹${Number(transaction.price).toLocaleString("en-IN")} per share.`,
    timestamp: transaction.date,
    status: transaction.status,
  }));

  return [...transactionItems, ...marketItems].sort((left, right) => {
    const leftTime = left.timestamp ? new Date(left.timestamp).getTime() : Date.now();
    const rightTime = right.timestamp ? new Date(right.timestamp).getTime() : Date.now();
    return rightTime - leftTime;
  });
};

export const announceReadNotificationsChange = () => {
  window.dispatchEvent(new Event("readNotificationsChange"));
};
