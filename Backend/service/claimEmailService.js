const sendEmail = require("./emailService");

/**
 * Send email notification when a new claim is submitted
 * @param {Object} owner - Item owner user object
 * @param {Object} claimer - Claimer user object
 * @param {Object} item - Item object
 * @param {Object} claim - Claim object
 */
const sendNewClaimEmail = async (owner, claimer, item, claim) => {
    try {
        const subject = `Someone claimed your item: ${item.title}`;
        
        const message = `Hi ${owner.fullName || owner.username},

Good news! Someone has ${claim.claimType === 'found' ? 'reported finding' : 'claimed'} your ${item.status} item "${item.title}".

Claim Details:
- Claimant: ${claimer.username}
- ${claim.claimType === 'found' ? 'Found at' : 'Details'}: ${claim.foundLocation || 'Not specified'}
- ${claim.claimType === 'found' ? 'Found on' : 'Date'}: ${claim.foundDate || 'Not specified'}
- Message: ${claim.message || 'No additional message'}

Please review this claim in your profile and approve if it's legitimate.

To review and manage claims, log in to CampusFindIt and go to:
Profile → My Posts → ${item.title}

Best regards,
CampusFindIt Team`;

        await sendEmail(
            process.env.SMTP_EMAIL,
            owner.email,
            subject,
            message
        );
        
        console.log(`New claim email sent to ${owner.email}`);
    } catch (err) {
        console.error("Error sending new claim email:", err);
    }
};

/**
 * Send email notification when a claim is approved (to claimer)
 * @param {Object} claimer - Claimer user object
 * @param {Object} owner - Item owner user object
 * @param {Object} item - Item object
 * @param {String} ownerEmail - Owner's contact email
 * @param {String} ownerPhone - Owner's contact phone
 */
const sendClaimApprovedEmailToClaimer = async (claimer, owner, item, ownerEmail, ownerPhone) => {
    try {
        const subject = `Your claim has been approved: ${item.title}`;
        
        const message = `Hi ${claimer.fullName || claimer.username},

Great news! The owner has approved your claim for "${item.title}".

Owner Contact Information:
📧 Email: ${ownerEmail || 'Not provided'}
📱 Phone: ${ownerPhone || 'Not provided'}

Please contact the owner to arrange pickup/return of the item.

Best regards,
CampusFindIt Team`;

        await sendEmail(
            process.env.SMTP_EMAIL,
            claimer.email,
            subject,
            message
        );
        
        console.log(`Claim approved email sent to claimer ${claimer.email}`);
    } catch (err) {
        console.error("Error sending claim approved email to claimer:", err);
    }
};

/**
 * Send email notification when a claim is approved (to owner)
 * @param {Object} owner - Item owner user object
 * @param {Object} claimer - Claimer user object
 * @param {Object} item - Item object
 */
const sendClaimApprovedEmailToOwner = async (owner, claimer, item) => {
    try {
        const subject = `You approved a claim: ${item.title}`;
        
        const message = `Hi ${owner.fullName || owner.username},

You have approved the claim by ${claimer.username} for "${item.title}".

Claimant Contact Information:
📧 Email: ${claimer.email || 'Not provided'}
📱 Phone: ${claimer.phone || 'Not provided'}

Please coordinate with them to complete the exchange.

Best regards,
CampusFindIt Team`;

        await sendEmail(
            process.env.SMTP_EMAIL,
            owner.email,
            subject,
            message
        );
        
        console.log(`Claim approved confirmation email sent to owner ${owner.email}`);
    } catch (err) {
        console.error("Error sending claim approved email to owner:", err);
    }
};

/**
 * Send email notification when a claim is rejected
 * @param {Object} claimer - Claimer user object
 * @param {Object} item - Item object
 */
const sendClaimRejectedEmail = async (claimer, item) => {
    try {
        const subject = `Claim update: ${item.title}`;
        
        const message = `Hi ${claimer.fullName || claimer.username},

Unfortunately, your claim for "${item.title}" was not approved by the owner.

This could be because:
- The item has already been claimed by someone else
- The provided information didn't match the item
- The owner found the item through other means

You can continue browsing other items on CampusFindIt.

Best regards,
CampusFindIt Team`;

        await sendEmail(
            process.env.SMTP_EMAIL,
            claimer.email,
            subject,
            message
        );
        
        console.log(`Claim rejected email sent to ${claimer.email}`);
    } catch (err) {
        console.error("Error sending claim rejected email:", err);
    }
};

module.exports = {
    sendNewClaimEmail,
    sendClaimApprovedEmailToClaimer,
    sendClaimApprovedEmailToOwner,
    sendClaimRejectedEmail
};
