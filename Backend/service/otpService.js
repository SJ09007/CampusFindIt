const {client} = require("../config/redisconn");
const sendEmail = require("../service/emailService");

const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    return otp;
}

const sendOtp = async(userId) => {
    try {
        const otp = generateOTP();

        
        const otpKey = `otp:${userId}:dkey`;      // OTP storage
        const triesKey = `otp:${userId}:tries`;   // Verification attempts
        const throttleKey = `otp:${userId}:throttle`; // Sending throttle
        
        const isThrottled = await client.get(throttleKey);
        if (isThrottled) {
            return { success: false, message: "Please wait before requesting another OTP" };
        }

          await client.setEx(otpKey, 600, otp);


  await client.setEx(triesKey, 600, String(0));


  await client.setEx(throttleKey, 60, String(1));

const emailSubject = "🔐 Verify Your CampusFindIt Account - Email Verification Required";
        const emailMessage = `Welcome to CampusFindIt!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 PURPOSE OF THIS EMAIL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for registering with CampusFindIt, your campus lost and found platform! To complete your registration and ensure the security of your account, we need to verify that this email address belongs to you.

This email contains a One-Time Password (OTP) that you'll need to enter on the verification page to activate your account.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 YOUR VERIFICATION CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                              ${otp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ HOW TO VERIFY YOUR ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Return to the CampusFindIt verification page
2. Enter the 4-digit code shown above
3. Click "Verify" to complete your registration
4. Start using CampusFindIt to find or report lost items!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ IMPORTANT SECURITY INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• This code will EXPIRE in 10 minutes for your security
• You have 5 attempts to enter the correct code
• Do NOT share this code with anyone
• CampusFindIt staff will NEVER ask for your OTP code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ DIDN'T REQUEST THIS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you didn't create a CampusFindIt account, please:
• Ignore this email - the code will expire automatically
• Do not share the code with anyone
• Contact us if you're concerned: support@campusfindit.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 WHAT'S NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Once verified, you'll be able to:
✓ Report lost items to help find them
✓ Post found items to help others
✓ Browse all lost and found items on campus
✓ Submit claims for items you've lost or found
✓ Connect with other students to reunite items

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❓ NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Having trouble with verification?
📧 Email: support@campusfindit.com
💬 Reply to this email for assistance

We're excited to have you join the CampusFindIt community!

Best regards,
The CampusFindIt Team
🤝 Helping reunite lost items with their owners across campus

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated email from CampusFindIt. Please do not reply directly to this email address.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await sendEmail("CampusFindIt <noreply@campusfindit.com>", userId, emailSubject, emailMessage);
  return { success: true, message: "OTP sent successfully" };
    } catch (err) {
        console.log(err);
    }
}

async function verifyOtp(userId, otp) {


  const otpKey = `otp:${userId}:dkey`;
  const triesKey = `otp:${userId}:tries`;

  const storedOtp = await client.get(otpKey);

  if (!storedOtp) {
    return { success: false, message: "OTP expired or not found" };
  }

  // Increment tries
  const tries = await client.incr(triesKey);

  // If first increment, set TTL same as OTP
  if (tries === 1) {
    await client.expire(triesKey, 600);
  }
  // Check max attempts
  if (tries > 5) {
    await client.del(otpKey);   // invalidate OTP
    await client.del(triesKey);
    return { success: false, message: "Too many attempts. OTP invalidated." };
  }

  // Check OTP
  if (storedOtp.toString() !== otp) {
    return { success: false, message: `Invalid OTP. Attempts left: ${5 - tries}` };
  }
  // Success → delete keys
  await client.del(otpKey);
  await client.del(triesKey);
  return { success: true, message: "OTP verified successfully" };
}

module.exports = { sendOtp, verifyOtp };