const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// 🚫 one feedback per user per profile
FeedbackSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.models.Feedback ||
  mongoose.model("Feedback", FeedbackSchema);
