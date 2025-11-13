// service/userAuth.js
const jwt = require("jsonwebtoken");

const isAuthenticted = async (req, res, next) => {
  try {
    // Log inbound auth-related headers (temporary debugging - remove later)
    console.log("----- AUTH MIDDLEWARE -----");
    console.log("Incoming headers.authorization:", req.headers.authorization);
    console.log(
      "Incoming cookie access_token:",
      req.cookies && req.cookies.access_token
    );
    // Also log the raw headers object keys for visibility
    // console.log("Raw headers keys:", Object.keys(req.headers));

    // 1) try cookie first
    let token = req.cookies && req.cookies.access_token;

    // 2) fallback: Authorization header "Bearer <token>"
    if (!token) {
      const authHeader =
        req.headers.authorization || req.headers.Authorization || "";
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else if (authHeader) {
        // header exists but not Bearer format — log it
        console.log(
          "Authorization header present but not Bearer format:",
          authHeader
        );
      }
    }

    if (!token) {
      console.log(
        "No token found (neither cookie nor Authorization header). Rejecting."
      );
      return res
        .status(401)
        .json({ error: "You are not authenticated (no token found)" });
    }

    // verify token and catch verification errors separately
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyErr) {
      console.log("Token verification failed:", verifyErr && verifyErr.message);
      return res
        .status(401)
        .json({ error: `Invalid token: ${verifyErr && verifyErr.message}` });
    }

    if (!decoded) {
      console.log("Token verified but decoded empty.");
      return res
        .status(401)
        .json({ error: "You are not authenticated (invalid token)" });
    }

    // good — attach user info and continue
    req.user = decoded;
    console.log("Auth OK. Decoded:", decoded);
    next();
  } catch (err) {
    console.error("Unexpected auth middleware error:", err);
    return res.status(500).json({ error: "Auth middleware failure" });
  }
};

module.exports = isAuthenticted;
