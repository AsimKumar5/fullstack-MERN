const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fullstack-mern-dxqt.onrender.com";

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
  const responseText = await response.text();
  let data = {};

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  const publicPaths = [
    "/loginUser",
    "/registerUser",
    "/logoutUser",
    "/forgotPassword",
    "/resetPassword",
  ];
  if (
    response.status === 401 &&
    path !== "/me" &&
    !publicPaths.includes(path) &&
    !path.startsWith("/stocks")
  ) {
    window.dispatchEvent(new Event("authSessionExpired"));
  }

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
};

export const registerUser = (data) =>
  apiRequest("/registerUser", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  apiRequest("/loginUser", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logoutUser = () =>
  apiRequest("/logoutUser", {
    method: "POST",
  });

export const requestPasswordReset = (email) =>
  apiRequest("/forgotPassword", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token, password) =>
  apiRequest("/resetPassword", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });

export const getCurrentUser = () => apiRequest("/me");
export const getDashboard = () => apiRequest("/dashboard");
export const getStocks = () => apiRequest("/stocks");
export const getStock = (symbol) =>
  apiRequest(`/stocks/${encodeURIComponent(symbol)}`);
export const getPortfolio = () => apiRequest("/portfolio");
export const getTransactions = () => apiRequest("/transactions");
export const getAnalytics = () => apiRequest("/analytics");
export const getAdminOverview = () => apiRequest("/admin/overview");
export const updateAdminUserStatus = (userId, isActive) =>
  apiRequest(`/admin/users/${encodeURIComponent(userId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
export const createAdminStock = (stock) =>
  apiRequest("/admin/stocks", {
    method: "POST",
    body: JSON.stringify(stock),
  });
export const updateAdminStock = (symbol, stock) =>
  apiRequest(`/admin/stocks/${encodeURIComponent(symbol)}`, {
    method: "PATCH",
    body: JSON.stringify(stock),
  });
