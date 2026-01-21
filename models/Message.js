// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema({
//     chatId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Chat",
//         required: true
//     },
//     senderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     senderName: String,

//     text: String,

//     file: String,
//     fileName: String,
//     fileType: String,

//     time: String
// }, { timestamps: true });

// export default mongoose.models.Message ||
//     mongoose.model("Message", MessageSchema);


const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: String,
    text: String,
    file: String,
    fileName: String,
    fileType: String,
    time: String,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

