const User = require("../models/User");
const Cart =require("../models/Cart");
const Data =require("../models/Data");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.manualSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({
        ok:false,
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
      ok:true,
      status: 200,
      message: "Sign up successful",
    });
  } catch (error) {
    return res.send({
      ok:false,
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
        ok:false,
        status: 401,
        message: "Invaid Email or Password",
      });
    }

    // Compare the provided password with the hashed password in the database
    if (password!==user.password) {
      return res.send({
        ok:false,
        status: 401,
        message: "Invalid Password",
      });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    return res.send({
      ok:true,
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
      ok:false,
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
        ok:false,
        status: 401,
        message: "User not found",
      });
    }

    return res.send({
      ok:true,
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
      ok:false,
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
        ok:false,
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
      ok:true,
      status: 200,
      message: "Product added to cart",
    });
  } catch (error) {
    return res.send({
      ok:false,
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
      ok:true,
      status: 200,
      message: "Cart fetched",
      data:itemCart
    });
  } catch (error) {
    return res.send({
      ok:false,
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Remove the item from the cart
    const result = await Cart.deleteOne({ userId, productId });

    // Check if an item was deleted
    if (result.deletedCount === 0) {
      return res.send({
        ok:false,
        status: 404,
        message: "Item not found in cart",
      });
    }

    return res.send({
      ok:true,
      status: 200,
      message: "Item removed from cart",
    });
  } catch (error) {
    return res.send({
      ok:false,
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


//////////////////////////////
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Data.find();
    return res.send(products);
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const productId=req.params.productId;
    const products = await Data.findOne({id:productId});
    return res.send(products);
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
////////////////////////////