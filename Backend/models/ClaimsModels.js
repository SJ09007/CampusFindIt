const mongoose = require("mongoose");

const ClaimSchema = mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    claimerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    foundLocation: {
        type: String,
        // Where they found/lost it
    },
    foundDate: {
        type: String,
        // When they found/lost it
    },
    claimType: {
        type: String,
        enum: ["found", "claim"], // 'found' = reporting found a lost item, 'claim' = claiming a found item
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Claim", ClaimSchema);