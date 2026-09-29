import express from "express";
import { getDashboard, loginUser, registerUser } from "../controllers/userController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.post("/registerUser",registerUser);
router.post("/loginUser",loginUser);
router.get("/dashboard", userAuth, getDashboard);

export default router;