// import mongoose from "mongoose";

// const NotificationSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ["SESSION_REQUEST", "SESSION_ACCEPT", "SESSION_DECLINE"],
//     required: true
//   },
//   message: String,
//   isRead: {
//     type: Boolean,
//     default: false
//   }
// }, { timestamps: true });

// export default mongoose.models.Notification ||
//   mongoose.model("Notification", NotificationSchema);




// import mongoose from "mongoose";

// const NotificationSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ["SESSION_REQUEST", "SESSION_ACCEPT", "SESSION_DECLINE"],
//     required: true
//   },
//   message: String,

//   // ✅ NEW (safe)
//   status: {
//     type: String,
//     enum: ["PENDING", "ACCEPTED", "DECLINED"],
//     default: "PENDING"
//   },

//   isRead: {
//     type: Boolean,
//     default: false
//   }
// }, { timestamps: true });

// export default mongoose.models.Notification ||
//   mongoose.model("Notification", NotificationSchema);




const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["SESSION_REQUEST", "SESSION_ACCEPT", "SESSION_DECLINE"],
      required: true
    },

    message: {
      type: String,
      default: ""
    },

    // ✅ STATUS FOR SESSION REQUEST FLOW
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "DECLINED"],
      default: "PENDING"
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* =====================================================
   🔐 UNIQUE CONSTRAINT (ANTI-SPAM / RACE-CONDITION FIX)
   Only ONE pending SESSION_REQUEST allowed
   between same sender → receiver
===================================================== */
NotificationSchema.index(
  {
    sender: 1,
    receiver: 1,
    type: 1,
    status: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      type: "SESSION_REQUEST",
      status: "PENDING"
    }
  }
);

module.exports = mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
