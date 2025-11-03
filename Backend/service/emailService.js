const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

let transporter = nodemailer.createTransport({
        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        // service: "gmail",
        host: "smtp.gmail.com",
    port: 465,
    secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

const sendEmail = async (from , to , subject, message) => {
    try {
        const info = await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: message,
        });
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log(err);
    }
};

module.exports = sendEmail;
    