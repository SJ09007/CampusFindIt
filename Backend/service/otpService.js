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

await sendEmail("No Reply@Alphafinder.com", userId, "OTP For Verification", "otp is " + otp);
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