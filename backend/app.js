import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/userRouter.js";
import { renderStocksPage } from "./controllers/stockController.js";
import { seedStocksIfEmpty } from "./models/stockModel.js";
import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns";

dns.setServers(["4.2.2.2"]);


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/stocks", renderStocksPage);
app.use("/api", router);

connectDB();
seedStocksIfEmpty();

app.listen(process.env.PORT || 4000, () => {
   console.log(`Server running on http://localhost:${process.env.PORT || 4000}`);
});