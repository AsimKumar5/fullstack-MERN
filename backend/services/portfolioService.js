import Stock from "../models/stockModel.js";
import Transaction from "../models/transactionModel.js";

const getPortfolioForUser = async (userId) => {
  const transactions = await Transaction.find({ user: userId })
    .select("symbol company type quantity price")
    .sort({ createdAt: 1, _id: 1 })
    .lean();
  const positions = new Map();

  for (const transaction of transactions) {
    const position = positions.get(transaction.symbol) || {
      symbol: transaction.symbol,
      company: transaction.company,
      quantity: 0,
      investment: 0,
    };

    if (transaction.type === "BUY") {
      position.quantity += transaction.quantity;
      position.investment += transaction.quantity * transaction.price;
    } else if (position.quantity > 0) {
      const soldQuantity = Math.min(position.quantity, transaction.quantity);
      const averageCost = position.investment / position.quantity;
      position.quantity -= soldQuantity;
      position.investment -= soldQuantity * averageCost;
    }

    positions.set(transaction.symbol, position);
  }

  const openPositions = [...positions.values()].filter(
    (position) => position.quantity > 0,
  );
  const stocks = await Stock.find({
    symbol: { $in: openPositions.map((position) => position.symbol) },
  })
    .select("symbol price -_id")
    .lean();
  const prices = new Map(stocks.map((stock) => [stock.symbol, stock.price]));
  const holdings = openPositions.map((position) => {
    const currentPrice = prices.get(position.symbol);

    if (currentPrice === undefined) {
      throw new Error(`Current price is unavailable for ${position.symbol}`);
    }

    return {
      symbol: position.symbol,
      company: position.company,
      quantity: position.quantity,
      buyPrice: position.investment / position.quantity,
      currentPrice,
    };
  });
  const totalInvestment = holdings.reduce(
    (total, holding) => total + holding.buyPrice * holding.quantity,
    0,
  );
  const totalValue = holdings.reduce(
    (total, holding) => total + holding.currentPrice * holding.quantity,
    0,
  );

  return {
    holdings,
    totalInvestment,
    totalValue,
    totalProfit: totalValue - totalInvestment,
  };
};

export { getPortfolioForUser };
