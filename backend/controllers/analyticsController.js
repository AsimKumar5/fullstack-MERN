import { getPortfolioForUser } from "../services/portfolioService.js";

const getAnalytics = async (req, res) => {
  try {
    const portfolio = await getPortfolioForUser(req.user.id);
    const profit = portfolio.totalProfit;
    const returnPercent = portfolio.totalInvestment
      ? (profit / portfolio.totalInvestment) * 100
      : 0;

    return res.status(200).json({
      summary: {
        investment: portfolio.totalInvestment,
        currentValue: portfolio.totalValue,
        profit,
        returnPercent: Number(returnPercent.toFixed(2)),
      },
      portfolioData: [],
      stockPerformance: portfolio.holdings.map((holding) => {
        const investment = holding.buyPrice * holding.quantity;
        const currentValue = holding.currentPrice * holding.quantity;

        return {
          name: holding.symbol,
          profit: currentValue - investment,
        };
      }),
      portfolioDistribution: portfolio.holdings.map((holding) => ({
        name: holding.symbol,
        value: holding.currentPrice * holding.quantity,
      })),
      holdings: portfolio.holdings.map((holding) => {
        const investment = holding.buyPrice * holding.quantity;
        const currentValue = holding.currentPrice * holding.quantity;
        const holdingProfit = currentValue - investment;

        return {
          ...holding,
          investment,
          currentValue,
          profit: holdingProfit,
          returnPercent: investment ? (holdingProfit / investment) * 100 : 0,
        };
      }),
    });
  } catch (error) {
    console.error("Unable to load analytics:", error);
    return res.status(500).json({ message: "Unable to load analytics" });
  }
};

export { getAnalytics };
