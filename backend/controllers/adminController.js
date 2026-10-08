import Stock from "../models/stockModel.js";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

const getAdminOverview = async (req, res) => {
  try {
    const [userCount, stockCount, transactionCount, users, stocks, transactions] =
      await Promise.all([
        User.countDocuments(),
        Stock.countDocuments(),
        Transaction.countDocuments(),
        User.find()
          .select("name email isActive createdAt")
          .sort({ createdAt: -1 })
          .limit(200)
          .lean(),
        Stock.find().select("name symbol price change").sort({ symbol: 1 }).lean(),
        Transaction.find()
          .sort({ createdAt: -1 })
          .limit(100)
          .populate("user", "name email")
          .lean(),
      ]);

    return res.status(200).json({
      summary: { users: userCount, stocks: stockCount, transactions: transactionCount },
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isActive: user.isActive !== false,
        createdAt: user.createdAt,
        isAdmin: user.email.trim().toLowerCase() === req.adminEmail,
      })),
      stocks: stocks.map((stock) => ({
        id: stock._id.toString(),
        name: stock.name,
        symbol: stock.symbol,
        price: stock.price,
        change: stock.change,
      })),
      transactions: transactions.map((transaction) => ({
        id: transaction._id.toString(),
        date: transaction.createdAt,
        user: transaction.user
          ? { name: transaction.user.name, email: transaction.user.email }
          : null,
        symbol: transaction.symbol,
        company: transaction.company,
        type: transaction.type,
        quantity: transaction.quantity,
        price: transaction.price,
        amount: transaction.quantity * transaction.price,
      })),
    });
  } catch (error) {
    console.error("Unable to load admin overview:", error);
    return res.status(500).json({ message: "Unable to load admin overview" });
  }
};

const updateUserStatus = async (req, res) => {
  const { isActive } = req.body ?? {};
  if (typeof isActive !== "boolean") {
    return res.status(422).json({ message: "isActive must be true or false" });
  }

  try {
    const user = await User.findById(req.params.userId).select("name email isActive");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.email.trim().toLowerCase() === req.adminEmail) {
      return res.status(403).json({ message: "The configured administrator cannot be deactivated" });
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
      message: isActive ? "User account activated" : "User account deactivated",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    console.error("Unable to update user status:", error);
    return res.status(500).json({ message: "Unable to update user status" });
  }
};

const validateStockInput = (body, requireSymbol) => {
  const { name, symbol, price, change } = body ?? {};
  if (
    typeof name !== "string" ||
    !name.trim() ||
    (requireSymbol && (typeof symbol !== "string" || !/^[A-Za-z0-9.-]{1,15}$/.test(symbol.trim()))) ||
    price === "" ||
    change === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0 ||
    !Number.isFinite(Number(change))
  ) {
    return null;
  }

  return {
    name: name.trim(),
    ...(requireSymbol ? { symbol: symbol.trim().toUpperCase() } : {}),
    price: Number(price),
    change: Number(change),
  };
};

const createStock = async (req, res) => {
  const values = validateStockInput(req.body, true);
  if (!values) {
    return res.status(422).json({
      message: "Provide a company name, valid symbol, non-negative price, and numeric daily change",
    });
  }

  try {
    const stock = await Stock.create(values);
    return res.status(201).json({ stock, message: "Stock added to the catalog" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That stock symbol already exists" });
    }
    console.error("Unable to create stock:", error);
    return res.status(500).json({ message: "Unable to create stock" });
  }
};

const updateStock = async (req, res) => {
  const values = validateStockInput(req.body, false);
  if (!values) {
    return res.status(422).json({
      message: "Provide a company name, non-negative price, and numeric daily change",
    });
  }

  try {
    const stock = await Stock.findOneAndUpdate(
      { symbol: req.params.symbol.toUpperCase() },
      values,
      { new: true, runValidators: true, select: "name symbol price change" },
    ).lean();

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.status(200).json({ stock, message: "Stock details updated" });
  } catch (error) {
    console.error("Unable to update stock:", error);
    return res.status(500).json({ message: "Unable to update stock" });
  }
};

export { createStock, getAdminOverview, updateStock, updateUserStatus };
