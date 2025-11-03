const otpservice = require("../service/otpService");
const User = require("../models/usersModel");


const sendOtp = async (req, res) => {
    try {
        if(User.findOne({ email: req.body.email })) {
            user = await User.findOne({ email: req.body.email });
            if(user.isdeleted) {
                return res.status(400).json("User has been deleted");
            }
            if(user.isactive) {
                return res.status(400).json("User is already activated activated");
            }
        }else{
            return res.status(404).json("User not found");
        }
        const result = await otpservice.sendOtp(req.body.email);



        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const verifyOtp = async (req, res) => {
    try {
        if(User.findOne({ email: req.body.email })) {
            user = await User.findOne({ email: req.body.email });
            if(user.isdeleted) {
                return res.status(400).json("User has been deleted");
            }
            if(user.isactive) {
                return res.status(400).json("User is already activated activated");
            }
        }else{
            return res.status(404).json("User not found");
        }
        const result = await otpservice.verifyOtp(req.body.email, req.body.otp);
        // User.findOneAndUpdate(req.body.email, { isactive: true });
        user = await User.findOne({ email: req.body.email });
        await User.findByIdAndUpdate(user._id, { isactive: true });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { sendOtp, verifyOtp };