const mongoose = require("mongoose");
const itemsModel = require("./itemsModel");

const ClaimedItemSchema = mongoose.Schema({
    // single item link ,multiple user link
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },


}, {
    timestamps: true,
});

module.exports = mongoose.model("ClaimedItem", ClaimedItemSchema);