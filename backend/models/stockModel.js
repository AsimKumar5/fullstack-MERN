import mongoose from "mongoose";
import stockData from "../data/stockData.js";

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    change: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Stock = mongoose.model("Stock", stockSchema);

export const seedStocksIfEmpty = async () => {
  if (await Stock.exists({})) return;
  await Stock.insertMany(stockData, { ordered: false });
};

export default Stock;
