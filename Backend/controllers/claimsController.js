const ClaimedItem = require("../models/ClaimsModels");
const Item = require("../models/itemsModel");

const addClaim = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json("Item not found");
        }

        if (item.status === "claimed" || item.status === "reported") {
            return res.status(400).json("Item has already been claimed");
        }

        if (item.postedby === req.user.id) {
            return res.status(400).json("You cannot claim your own item");
        }

        let claim = await ClaimedItem.findOne({ item: req.params.id });

        if (claim && claim.users.some(userId => userId.equals(req.user.id))) {
            return res.status(400).json("You have already claimed this item");
        }

        if (claim) {
            claim.users.push(req.user.id);
            await claim.save();
            return res.status(200).json(claim);
        }

        // No claim exists yet
        const claimedItem = await ClaimedItem.create({
            item: item._id,
            users: [req.user.id]
        });
        return res.status(200).json(claimedItem);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};


const getItemClaims = async (req, res) => {
    try {
        const claims = await ClaimedItem.find({item: req.params.id});
        res.status(200).json(claims);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {addClaim, getItemClaims};