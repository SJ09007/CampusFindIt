const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const sendEmail = require("../service/emailService");

const registerAdmin = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      isadmin: true,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
const registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    password = req.body.password;
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json("Password is not strong enough");
    }

    phonenumber = req.body.phonenumber;
    if (!validator.isMobilePhone(phonenumber, "any")) {
      return res.status(400).json("Phone number is not valid");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const existinguser = await User.findOne({ email: req.body.email });
    if (existinguser && !existinguser.isdeleted) {
      await sendEmail(
        process.env.SMTP_EMAIL,
        req.body.email,
        "User already exists",
        "User already exists"
      );
      return res.status(400).json("User already exists");
    }
    if (existinguser && existinguser.isdeleted) {
      await User.findByIdAndUpdate(existinguser._id, { isdeleted: false });
      // update password
      await User.findByIdAndUpdate(existinguser._id, {
        password: hashedPassword,
      });
      return res.status(200).json("User has been register again");
      await sendEmail(
        process.env.SMTP_EMAIL,
        req.body.email,
        "User registered again",
        "User registered again"
      );
    }

    const newUser = new User({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      studentId: req.body.studentId,
      password: hashedPassword,
      phonenumber: req.body.phonenumber,
      studentId: req.body.studentId,
    });
    const user = await newUser.save();

    // Send OTP immediately after registration
    const otpservice = require("../service/otpService");
    try {
      await otpservice.sendOtp(req.body.email);
    } catch (otpError) {
      console.error("Failed to send OTP:", otpError);
    }

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
    if (user.isdeleted) {
      return res.status(400).json("User has been deleted");
    }
    if (user.isactive == false) {
      return res.status(400).json("User is not active");
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
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({ ...others, token });
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

const delete_user = async (req, res) => {
  try {
    // soft delete
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (user.isdeleted) {
      return res.status(400).json("User has been deleted");
    }
    if (user.isactive == false) {
      return res.status(400).json("User is not active");
    }
    if (req.id != req.params.id) {
      return res.status(400).json("You can only delete your account");
    }
    await User.findByIdAndUpdate(req.params.id, { isdeleted: true });
    await sendEmail(
      process.env.SMTP_EMAIL,
      req.body.email,
      "User deleted",
      "User deleted"
    );
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

const get_user_detail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (user.isdeleted) {
      return res.status(400).json("User has been deleted");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

const changepassword = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.status(200).json("Password has been changed");
  } catch (err) {
    res.status(500).json(err);
  }
};

const update_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (user.isdeleted) {
      return res.status(400).json("User has been deleted");
    }
    if (user.isactive == false) {
      return res.status(400).json("User is not active");
    }
    if (req.id != req.params.id) {
      return res.status(400).json("You can only update your account");
    }
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json("User has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  registerUser,
  login,
  logout,
  delete_user,
  get_user_detail,
  changepassword,
  update_user,
  registerAdmin,
};
