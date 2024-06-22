const User = require("../models/User");
const Cart =require("../models/Cart");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.manualSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({
        status: 400,
        message: "Email alreay Registered",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    return res.send({
      status: 200,
      message: "Sign up successful",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.manual_login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({
        status: 401,
        message: "Invaid Email or Password",
      });
    }

    // Compare the provided password with the hashed password in the database
    if (password!==user.password) {
      return res.send({
        status: 401,
        message: "Invalid Password",
      });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    return res.send({
      status: 200,
      message: "Sign in successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.send({
        status: 401,
        message: "User not found",
      });
    }

    return res.send({
      status: 200,
      message: "User found",
      user:{
      id: user._id,
      username: user.username,
      email: user.email,
      }
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error:error.message
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { userId, username, productId } = req.body;
    const existingCart = await Cart.findOne({ userId,productId });
    if (existingCart) {
      return res.send({
        status: 400,
        message: "Product already in the cart",
      });
    }

    const newCart = new Cart({
      userId,
      username,
      productId,
    });

    await newCart.save();

    return res.send({
      status: 200,
      message: "Product added to cart",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const itemCart = await Cart.find({ userId});
    return res.send({
      status: 200,
      message: "Cart fetched",
      data:itemCart
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};