import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/userRouter.js";
import { renderStocksPage } from "./controllers/stockController.js";
import { seedStocksIfEmpty } from "./models/stockModel.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "https://fullstack-mern-frontend-2lqi.onrender.com",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/stocks", renderStocksPage);
app.use("/api", router);

const startServer = async () => {
    await connectDB();
    await seedStocksIfEmpty();

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});