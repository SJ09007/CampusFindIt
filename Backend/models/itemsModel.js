const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        options: ["wallet","keys","phone","laptop","earphones","mobile","tablet","camera","accessories","other"],
    },
    status: {
        type: String,
        required: true,
        options: ["lost","found","reported","claimed"],
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    // posted by which user
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // claimed by which user
    claimedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    
    // image is array of strings
    images: {
        type: [String],
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Item", itemSchema);