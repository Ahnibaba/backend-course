import jwt from "jsonwebtoken";
import db from "../db.js";

function authMiddleware (req, res, next) {
  const token = req.headers["authorization"]

  if(!token) {
    return res.status(401).json({ message: "No token provided" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
     if(err) {
        return res.status(403).json({ message: "Invalid token" })
     }
     const prep = db.prepare(`
        SELECT * FROM users
        WHERE id = ?
    `)
    const user = prep.get(decoded.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.userId = user.id
    next()
  })
}

export default authMiddleware