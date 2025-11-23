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
        const subject = `New Claim Submitted for Your Item - ${item.title}`;
        
        const message = `Dear ${owner.fullName || owner.username},

Someone has submitted a claim for your ${item.status} item.

ITEM DETAILS:
- Name: ${item.title}
- Status: ${item.status.toUpperCase()}
- Location: ${item.location || 'Not specified'}
- Category: ${item.category || 'Not specified'}

CLAIMANT INFORMATION:
- Username: ${claimer.username}
- Claim Type: ${claim.claimType === 'found' ? 'Found Item Report' : 'Ownership Claim'}
- Location: ${claim.foundLocation || 'Not specified'}
- Date: ${claim.foundDate || 'Not specified'}

Message from claimant:
${claim.message || 'No additional message provided.'}

NEXT STEPS:
1. Log in at http://localhost:3000/auth
2. Go to Profile > My Posts > View Claims
3. Review the claim details
4. Approve or reject within 48 hours

Need help? Contact support@campusfindit.com

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
        const subject = `Claim Approved - Contact Information for ${item.title}`;
        
        const message = `Dear ${claimer.fullName || claimer.username},

Your claim has been approved.

ITEM DETAILS:
- Name: ${item.title}
- Status: ${item.status.toUpperCase()}
- Category: ${item.category || 'Not specified'}

OWNER CONTACT:
- Name: ${owner.fullName || owner.username}
- Email: ${ownerEmail || 'Not provided'}
- Phone: ${ownerPhone || 'Not provided'}

NEXT STEPS:
1. Contact the owner using the information above
2. Arrange a meeting at a safe, public location on campus
3. Bring your student ID for verification
4. Complete the exchange

SAFETY REMINDERS:
- Meet in a public, well-lit area
- Consider bringing a friend
- Let someone know where you're going
- Trust your instincts

Need help? Contact support@campusfindit.com

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
        const subject = `Claim Approval Confirmation - ${item.title}`;
        
        const message = `Dear ${owner.fullName || owner.username},

You have approved the claim for your item.

ITEM DETAILS:
- Name: ${item.title}
- Status: ${item.status.toUpperCase()}
- Category: ${item.category || 'Not specified'}

CLAIMANT CONTACT:
- Name: ${claimer.fullName || claimer.username}
- Email: ${claimer.email || 'Not provided'}
- Phone: ${claimer.phone || 'Not provided'}

NEXT STEPS:
1. Wait for the claimant to contact you or reach out first
2. Arrange a meeting at a safe, public location on campus
3. Bring the item and your student ID
4. Complete the exchange

SAFETY REMINDERS:
- Meet in a public, well-lit area
- Consider bringing a friend
- Let someone know where you're going
- Trust your instincts

Need help? Contact support@campusfindit.com

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
        const subject = `Claim Status Update - ${item.title}`;
        
        const message = `Dear ${claimer.fullName || claimer.username},

Your claim for "${item.title}" was not approved by the owner.

CLAIM DETAILS:
- Item: ${item.title}
- Status: ${item.status.toUpperCase()}
- Result: Not Approved

POSSIBLE REASONS:
- Item already claimed by someone else
- Information didn't match item details
- Owner found item through other means
- Timing or location details didn't align

WHAT YOU CAN DO:
1. Continue browsing CampusFindIt for new items
2. Post your own lost or found item
3. Check notifications regularly

TIPS FOR FUTURE CLAIMS:
- Provide detailed descriptions
- Include specific dates, times, and locations
- Mention unique identifying features
- Respond quickly to inquiries

Need help? Contact support@campusfindit.com

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
