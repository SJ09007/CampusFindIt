const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phonenumber: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isdeleted: {
            type: Boolean,
            default: false,
        },
        studentId: {
            type: String,
            sparse: true,
            unique: true,
        },
        isactive: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);