const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const otpRoute = require("./routes/otpVerificationRoute");
const itemRoute = require("./routes/itemsRoute");
const claimRoute = require("./routes/claimsRoute");

const cookieParser = require("cookie-parser");
const {connectRedis}  = require("./config/redisconn");

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/otp", otpRoute);
app.use("/api/items", itemRoute);
app.use("/api/claims", claimRoute);

connectDB().then(() => {
    console.log("Connected to MongoDB");
    connectRedis().then(() => {
        console.log("Connected to Redis");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
    });
    })
    
}).catch((err) => {
    console.log(err);
})


