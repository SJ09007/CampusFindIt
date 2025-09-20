const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log("1");
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log("email = ", req.body.email);

    const existinguser = await User.findOne({ email: req.body.email });
    console.log("3");
    if (existinguser) {
      return res.status(400).json("User already exists");
    }
    console.log(req.body);

    const newUser = new User({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      studentId: req.body.studentId || null,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Wrong Password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    });
    res.status(200).json("User has been logged out");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  registerUser,
  login,
  logout,
};
