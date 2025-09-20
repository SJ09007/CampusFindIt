const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
