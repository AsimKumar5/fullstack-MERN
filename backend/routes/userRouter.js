import express from "express";
import {
  getDashboard,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/userAuth.js";
import { getTransactions } from "../controllers/transactionController.js";
import { getPortfolio } from "../controllers/portfolioController.js";
import { getAnalytics } from "../controllers/analyticsController.js";
import { getStock, getStocks } from "../controllers/stockController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createStock,
  getAdminOverview,
  updateStock,
  updateUserStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/registerUser",registerUser);
router.post("/loginUser",loginUser);
router.post("/logoutUser", logoutUser);
router.post("/forgotPassword", requestPasswordReset);
router.post("/resetPassword", resetPassword);
router.get("/me", userAuth, getCurrentUser);
router.get("/dashboard", userAuth, getDashboard);
router.get("/transactions", userAuth, getTransactions);
router.get("/portfolio", userAuth, getPortfolio);
router.get("/analytics", userAuth, getAnalytics);
router.get("/stocks", getStocks);
router.get("/stocks/:symbol", getStock);
router.get("/admin/overview", userAuth, adminAuth, getAdminOverview);
router.patch("/admin/users/:userId/status", userAuth, adminAuth, updateUserStatus);
router.post("/admin/stocks", userAuth, adminAuth, createStock);
router.patch("/admin/stocks/:symbol", userAuth, adminAuth, updateStock);

export default router;