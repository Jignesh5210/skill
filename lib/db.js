const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

async function connectDB() {
  if (!MONGO_URI) {
    console.warn("⚠️ MONGO_URI not found");
    return null;
  }

  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGO_URI);
  return cached.conn;
}

module.exports = { connectDB };
