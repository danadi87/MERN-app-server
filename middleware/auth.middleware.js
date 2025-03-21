const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  console.log("in the authenticated middleware:", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const theToken = req.headers.authorization.split(" ")[1];
    try {
      const payload = jwt.verify(theToken, process.env.TOKEN_SECRET);
      req.payload = payload;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(403).json({ message: "no token present" });
  }
}
module.exports = { isAuthenticated };
