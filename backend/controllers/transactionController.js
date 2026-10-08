import Transaction from "../models/transactionModel.js";

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return res.status(200).json(
      transactions.map((transaction) => ({
        id: transaction._id.toString(),
        date: transaction.createdAt.toISOString(),
        stock: transaction.symbol,
        symbol: transaction.symbol,
        company: transaction.company,
        type: transaction.type,
        quantity: transaction.quantity,
        price: transaction.price,
        amount: transaction.quantity * transaction.price,
        status: "Completed",
      })),
    );
  } catch (error) {
    console.error("Unable to load transactions:", error);
    return res.status(500).json({ message: "Unable to load transactions" });
  }
};

export { getTransactions };
