const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");
const cookieParser = require("cookie-parser");

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
