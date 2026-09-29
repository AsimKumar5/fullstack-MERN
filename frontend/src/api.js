const apiRequest = async (path, options = {}) => {
  const response = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
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

  if (!response.ok) throw new Error(data.message || "Request failed");
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
  
export const getDashboard = () => apiRequest("/dashboard");
export const getStocks = () => apiRequest("/stocks");
export const getStock = (symbol) => apiRequest(`/stocks/${symbol}`);
export const getPortfolio = () => apiRequest("/portfolio");
export const getTransactions = () => apiRequest("/transactions");
export const getAnalytics = () => apiRequest("/analytics");