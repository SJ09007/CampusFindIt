const Item = require("../models/itemsModel");
const ClaimedItem = require("../models/ClaimsModels");

const createItem = async (req, res) => {
    try {
                
        // console.log("req.user:", req);

        if (!req.body.title || !req.body.description || !req.body.category || !req.body.status || !req.body.location || !req.body.date) {
            return res.status(400).json("All fields are required");
        }
        // postedby by logged in user
        if (!req.user ) {
            return res.status(401).json({ error: "Unauthorized. No user found in request." });
        }
        
        current_user = req.user.id;
        req.body.postedBy = current_user;

        const item = await Item.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFoundItems = async (req, res) => {
    try {
        const items = await Item.find({ status: "found" });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getLostItems = async (req, res) => {
    try {
        const items = await Item.find({ status: "lost" });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getMyItemsPosted = async (req, res) => {
    try {
        const items = await Item.find({ postedby: req.user._id });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getMyPostedItemsFound = async (req, res) => {
    try {
        const items = await Item.find({ postedby: req.user._id, status: "found" });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getMyPostedItemsLost = async (req, res) => {
    try {
        const items = await Item.find({ postedby: req.user._id, status: "lost" });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getItemsPostedOnDate = async (req, res) => {
    try {
        const items = await Item.find({ date: req.params.date });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
};

const update_status = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json("Item not found");
        }

        if(item.status == "claimed" || item.status == "reported") {
            return res.status(400).json("Item has already been claimed");
        }
     
        if(item.postedBy._id.toString() != req.user.id) {
            return res.status(400).json("You can only update your items");
        }
        // find all persons who have claimed the item
        const claims = await ClaimedItem.find({ item: req.params.id });
           console.log(item.postedBy._id.toString());
        console.log(req.user.id);
const userIdStr = req.user.id; // or req.body.userid if you're using that


          console.log(item.status);

        if(item.status == "lost"){
            item.status = "reported";
            item.claimedBy = req.body.userid;
        }else if(item.status == "found"){
            item.status = "claimed";
            item.claimedBy = req.body.userid;
        }
        console.log(item.status);
        await item.save();
        res.status(200).json("Item status has been updated");
    } catch (err) {
        res.status(500).json(err);
    }
};






module.exports = { createItem, getAllItems, getFoundItems, getLostItems, getMyItemsPosted, getMyPostedItemsFound, getMyPostedItemsLost, getItemsPostedOnDate, update_status };