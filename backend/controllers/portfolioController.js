import { getPortfolioForUser } from "../services/portfolioService.js";

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await getPortfolioForUser(req.user.id);
    return res.status(200).json(portfolio);
  } catch (error) {
    console.error("Unable to load portfolio:", error);
    return res.status(500).json({ message: "Unable to load portfolio" });
  }
};

export { getPortfolio };
