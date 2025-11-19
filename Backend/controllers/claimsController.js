const Claim = require("../models/ClaimsModels");
const Item = require("../models/itemsModel");
const User = require("../models/usersModel");
const { sendNewClaimEmail, sendClaimApprovedEmailToClaimer, sendClaimApprovedEmailToOwner, sendClaimRejectedEmail } = require("../service/claimEmailService");
const { createNotification } = require("../service/notificationService");

/**
 * Add a new claim for an item
 */
const addClaim = async (req, res) => {
    try {
        const { message, foundLocation, foundDate, claimType } = req.body;
        
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Check if item is already claimed/reported
        if (item.status === "claimed" || item.status === "reported") {
            return res.status(400).json({ message: "Item has already been claimed" });
        }

        // Check if user is trying to claim their own item
        if (item.postedBy.toString() === req.user.id) {
            return res.status(400).json({ message: "You cannot claim your own item" });
        }

        // Check if user already claimed this item
        const existingClaim = await Claim.findOne({ 
            itemId: req.params.id, 
            claimerId: req.user.id 
        });
        
        if (existingClaim) {
            return res.status(400).json({ message: "You have already claimed this item" });
        }

        // Create new claim
        const claim = await Claim.create({
            itemId: item._id,
            claimerId: req.user.id,
            message: message || "",
            foundLocation: foundLocation || "",
            foundDate: foundDate || "",
            claimType: claimType || (item.status === "lost" ? "found" : "claim"),
            status: "pending"
        });

        // Get owner and claimer details
        const owner = await User.findById(item.postedBy);
        const claimer = await User.findById(req.user.id);

        if (owner && claimer) {
            // Send email notification to owner
            sendNewClaimEmail(owner, claimer, item, claim).catch(err => 
                console.error("Email send failed:", err)
            );

            // Create in-app notification for owner
            const notificationMessage = `${claimer.username} ${claim.claimType === 'found' ? 'reported finding' : 'claimed'} your ${item.status} item: ${item.title}`;
            createNotification(owner._id, "claim", notificationMessage, item._id, claim._id).catch(err =>
                console.error("Notification creation failed:", err)
            );
        }

        return res.status(201).json(claim);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get all claims for an item (with populated user data)
 */
const getItemClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ itemId: req.params.id })
            .populate('claimerId', 'username email phone fullName')
            .sort({ createdAt: -1 });
        res.status(200).json(claims);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get claim count for an item
 */
const getClaimCount = async (req, res) => {
    try {
        const count = await Claim.countDocuments({ 
            itemId: req.params.id,
            status: { $ne: "rejected" } // Don't count rejected claims
        });
        res.status(200).json({ count });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Approve a claim
 */
const approveClaim = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const claim = await Claim.findById(req.params.id)
            .populate('claimerId', 'username email phone fullName')
            .populate('itemId');
        
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        const item = claim.itemId;
        
        // Verify user is the item owner
        if (item.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only approve claims for your own items" });
        }

        // Update claim status
        claim.status = "approved";
        claim.approvedBy = req.user.id;
        await claim.save();

        // Update item status
        item.status = item.status === "lost" ? "reported" : "claimed";
        await item.save();

        // Get owner details
        const owner = await User.findById(req.user.id);
        
        // Prepare contact info
        const ownerEmail = item.contactEmail || owner.email;
        const ownerPhone = item.contactPhone || owner.phone;

        // Send email notifications to both parties
        if (owner && claim.claimerId) {
            // Email to claimer with owner contact
            sendClaimApprovedEmailToClaimer(
                claim.claimerId, 
                owner, 
                item, 
                ownerEmail, 
                ownerPhone
            ).catch(err => console.error("Email send failed:", err));

            // Email to owner with claimer contact
            sendClaimApprovedEmailToOwner(
                owner, 
                claim.claimerId, 
                item
            ).catch(err => console.error("Email send failed:", err));

            // Create in-app notification for claimer
            const notificationMessage = `Your claim for "${item.title}" has been approved! Check your email for contact details.`;
            createNotification(
                claim.claimerId._id, 
                "approved", 
                notificationMessage, 
                item._id, 
                claim._id
            ).catch(err => console.error("Notification creation failed:", err));
        }

        res.status(200).json({ 
            message: "Claim approved successfully",
            claim,
            ownerContact: {
                email: ownerEmail,
                phone: ownerPhone
            },
            claimerContact: {
                email: claim.claimerId.email,
                phone: claim.claimerId.phone
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Reject a claim
 */
const rejectClaim = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const claim = await Claim.findById(req.params.id).populate('itemId');
        
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        const item = claim.itemId;
        
        // Verify user is the item owner
        if (item.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only reject claims for your own items" });
        }

        // Update claim status
        claim.status = "rejected";
        await claim.save();

        // Get claimer details
        const claimer = await User.findById(claim.claimerId);

        if (claimer) {
            // Send email notification to claimer
            sendClaimRejectedEmail(claimer, item).catch(err => 
                console.error("Email send failed:", err)
            );

            // Create in-app notification for claimer
            const notificationMessage = `Your claim for "${item.title}" was not approved by the owner.`;
            createNotification(
                claimer._id, 
                "rejected", 
                notificationMessage, 
                item._id, 
                claim._id
            ).catch(err => console.error("Notification creation failed:", err));
        }

        res.status(200).json({ message: "Claim rejected", claim });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get all claims made by the current user
 */
const getMyClaims = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        const claims = await Claim.find({ claimerId: req.user.id })
            .populate('itemId', 'title images status contactEmail contactPhone postedBy')
            .populate({
                path: 'itemId',
                populate: {
                    path: 'postedBy',
                    select: 'email phone username'
                }
            })
            .sort({ createdAt: -1 });
        
        res.status(200).json(claims);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { 
    addClaim, 
    getItemClaims, 
    getClaimCount,
    approveClaim,
    rejectClaim,
    getMyClaims
};