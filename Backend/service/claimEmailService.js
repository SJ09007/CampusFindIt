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
        const subject = `🔔 Action Required: New Claim Submitted for Your ${item.status} Item - ${item.title}`;
        
        const message = `Dear ${owner.fullName || owner.username},

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 PURPOSE OF THIS EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are receiving this email because someone has submitted a claim for an item you posted on CampusFindIt. This notification requires your review and action to help reunite the item with its rightful owner or finder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 YOUR ITEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Item Name:        ${item.title}
Item Status:      ${item.status.toUpperCase()}
Posted Location:  ${item.location || 'Not specified'}
Category:         ${item.category || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CLAIMANT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Username:         ${claimer.username}
Claim Type:       ${claim.claimType === 'found' ? '🔍 Found Item Report (They found your lost item)' : '✋ Ownership Claim (They claim to own this item)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CLAIM DETAILS PROVIDED BY CLAIMANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${claim.claimType === 'found' ? 'Location Where Found' : 'Claim Location'}:  ${claim.foundLocation || 'Not specified'}
${claim.claimType === 'found' ? 'Date When Found' : 'Claim Date'}:          ${claim.foundDate || 'Not specified'}

Additional Message from Claimant:
${claim.message || 'No additional message was provided by the claimant.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ WHAT YOU NEED TO DO NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please review this claim and take action within 48 hours:

1. 🔐 Log in to your CampusFindIt account at: http://localhost:3000/auth

2. 📂 Navigate to: Profile → My Posts → View Claims

3. 🔍 Review the claim details carefully:
   - Verify the information matches your item
   - Check if the location and date make sense
   - Read any additional messages from the claimant

4. ✅ Make a decision:
   - APPROVE: If you believe this is a legitimate claim
   - REJECT: If the information doesn't match or seems incorrect

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤝 WHAT HAPPENS AFTER YOU APPROVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Once you approve the claim:
✓ Both you and the claimant will receive each other's contact information
✓ You can coordinate directly to arrange the item exchange
✓ The item will be marked as resolved on the platform
✓ You'll both receive confirmation emails with contact details

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have questions or concerns about this claim:
📧 Email: support@campusfindit.com
💬 Reply to this email for assistance

Thank you for using CampusFindIt to help reunite lost items with their owners!

Best regards,
The CampusFindIt Team
🤝 Helping reunite lost items with their owners across campus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated notification from CampusFindIt. Please do not reply directly to this email address.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

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
        const subject = `✅ Claim Approved! Contact Information for ${item.title}`;
        
        const message = `Dear ${claimer.fullName || claimer.username},

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 PURPOSE OF THIS EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Congratulations! The owner has reviewed and APPROVED your claim for their item. This email contains the owner's contact information so you can coordinate the item exchange.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 ITEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Item Name:        ${item.title}
Item Status:      ${item.status.toUpperCase()}
Category:         ${item.category || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 OWNER CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Owner Name:       ${owner.fullName || owner.username}
📧 Email:         ${ownerEmail || 'Not provided'}
📱 Phone:         ${ownerPhone || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ NEXT STEPS - WHAT TO DO NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 📞 Contact the owner using the information provided above
   - Introduce yourself and reference the item: "${item.title}"
   - Be polite and professional in your communication

2. 🤝 Coordinate a meeting:
   - Agree on a safe, public location on campus
   - Set a convenient time for both parties
   - Consider meeting at campus security or a busy common area

3. 🆔 Prepare for the exchange:
   - Bring your student ID for verification
   - Be ready to describe the item or provide proof of ownership if needed
   - Arrive on time at the agreed location

4. ✅ Complete the exchange:
   - Verify the item matches your claim
   - Thank the owner for their help
   - Consider marking the item as resolved on CampusFindIt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ SAFETY REMINDERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Always meet in a public, well-lit area on campus
• Consider bringing a friend with you
• Let someone know where you're going and when you'll be back
• Trust your instincts - if something feels wrong, reschedule

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any issues or concerns:
📧 Email: support@campusfindit.com
💬 Reply to this email for assistance

Thank you for using CampusFindIt! We're glad we could help facilitate this connection.

Best regards,
The CampusFindIt Team
🤝 Helping reunite lost items with their owners across campus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated notification from CampusFindIt. Please do not reply directly to this email address.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

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
        const subject = `✅ Claim Approval Confirmation - Claimant Contact Information for ${item.title}`;
        
        const message = `Dear ${owner.fullName || owner.username},

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 PURPOSE OF THIS EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a confirmation that you have successfully approved the claim submitted by ${claimer.username} for your item. This email contains the claimant's contact information so you can coordinate the item exchange.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 ITEM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Item Name:        ${item.title}
Item Status:      ${item.status.toUpperCase()}
Category:         ${item.category || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CLAIMANT CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Claimant Name:    ${claimer.fullName || claimer.username}
📧 Email:         ${claimer.email || 'Not provided'}
📱 Phone:         ${claimer.phone || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ NEXT STEPS - WHAT TO DO NOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 📞 Wait for the claimant to contact you, or reach out first:
   - They will receive your contact information as well
   - Be responsive to their messages or calls

2. 🤝 Coordinate a meeting:
   - Agree on a safe, public location on campus
   - Set a convenient time for both parties
   - Consider meeting at campus security or a busy common area

3. 🆔 Prepare for the exchange:
   - Bring the item with you
   - Bring your student ID for verification
   - You may ask the claimant to verify ownership details
   - Arrive on time at the agreed location

4. ✅ Complete the exchange:
   - Hand over the item to the claimant
   - Consider marking the item as resolved on CampusFindIt
   - Thank them for using the platform

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ SAFETY REMINDERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Always meet in a public, well-lit area on campus
• Consider bringing a friend with you
• Let someone know where you're going and when you'll be back
• Trust your instincts - if something feels wrong, reschedule

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any issues or concerns:
📧 Email: support@campusfindit.com
💬 Reply to this email for assistance

Thank you for using CampusFindIt and helping reunite items with their rightful owners!

Best regards,
The CampusFindIt Team
🤝 Helping reunite lost items with their owners across campus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated notification from CampusFindIt. Please do not reply directly to this email address.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

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
        const subject = `❌ Claim Status Update: ${item.title}`;
        
        const message = `Dear ${claimer.fullName || claimer.username},

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 PURPOSE OF THIS EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This email is to inform you about the status of your claim submission on CampusFindIt. After reviewing your claim, the item owner has decided not to approve it at this time.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 CLAIM INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Item Name:        ${item.title}
Item Status:      ${item.status.toUpperCase()}
Claim Status:     NOT APPROVED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ WHY WASN'T MY CLAIM APPROVED?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

There could be several reasons why your claim was not approved:

• ✓ The item has already been claimed by someone else
• ✓ The information you provided didn't match the item details
• ✓ The owner found the item through other means
• ✓ The owner is still verifying multiple claims
• ✓ The timing or location details didn't align with the owner's records

Please note: This is not a reflection on you personally. The owner is simply trying to ensure the item reaches its rightful owner or finder.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ WHAT YOU CAN DO NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Don't be discouraged! Here are your next steps:

1. 🔍 Continue browsing CampusFindIt:
   - Visit: http://localhost:3000/browse
   - Check for new items posted daily
   - Set up alerts for items matching your description

2. 📝 Post your own item:
   - If you lost something, create a "Lost Item" post
   - If you found something, create a "Found Item" post
   - Provide detailed descriptions to help others identify it

3. 🔔 Stay active on the platform:
   - Check your notifications regularly
   - Respond promptly to any inquiries
   - Keep your contact information up to date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 TIPS FOR FUTURE CLAIMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To increase your chances of claim approval:
• Provide as much detail as possible about the item
• Include specific dates, times, and locations
• Mention unique identifying features
• Be honest and accurate in your descriptions
• Respond quickly to owner inquiries

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have questions or believe there was an error:
📧 Email: support@campusfindit.com
💬 Reply to this email for assistance

We appreciate your use of CampusFindIt and hope you find what you're looking for soon!

Best regards,
The CampusFindIt Team
🤝 Helping reunite lost items with their owners across campus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated notification from CampusFindIt. Please do not reply directly to this email address.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

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
