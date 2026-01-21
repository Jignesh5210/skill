// import jwt from "jsonwebtoken";

// export function createToken(id) {
//   return jwt.sign(
//     { id }, // ✅ consistent with decoded.id
//     process.env.JWT_SECRET,
//     { expiresIn: "5d" }
//   );
// }

// export function verifyToken(token) {
//   return jwt.verify(token, process.env.JWT_SECRET);
// }

const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, verifyToken };
