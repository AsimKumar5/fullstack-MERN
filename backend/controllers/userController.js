import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//<--------------------register User-------------------->
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(422).json({
        message: "fill all details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({
        message: "Email already registered",
      });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({
        message: "password and confirmPassword are not same",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

//<--------------------login User-------------------->
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "fill all required details",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Wrong Email",
      });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(401).json({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      message: "Login Successfully",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Incorrect details",
      error: err.message,
    });
  }
};

const getDashboard = (req, res) => {
  return res.status(200).json({
    marketData: [
      { name: "NIFTY 50", value: 22405, change: 0.84 },
      { name: "SENSEX", value: 73738, change: 0.72 },
      { name: "BANK NIFTY", value: 47825, change: -0.31 },
    ],
    topStocks: [
      {
        name: "Tata Consultancy Services",
        symbol: "TCS",
        price: 3820,
        change: 2.45,
      },
      { name: "Infosys", symbol: "INFY", price: 1650, change: 1.82 },
      {
        name: "Reliance Industries",
        symbol: "RELIANCE",
        price: 1450,
        change: -0.75,
      },
    ],
    recentTransactions: [],
    chartData: [
      { day: "Mon", value: 105000 },
      { day: "Tue", value: 108000 },
      { day: "Wed", value: 107500 },
      { day: "Thu", value: 112000 },
      { day: "Fri", value: 115000 },
      { day: "Sat", value: 113500 },
      { day: "Sun", value: 125450 },
    ],
  });
};

export { registerUser, loginUser, getDashboard };
