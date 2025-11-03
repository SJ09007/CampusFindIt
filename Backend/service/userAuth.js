const jwt = require("jsonwebtoken");

const isAuthenticted = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json("You are not authenticated");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json("You are not authenticated");
        }
        // req.id = decoded.id;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = isAuthenticted;