const mongoose = require("mongoose");

const VideoRoomSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports =
    mongoose.models.VideoRoom || mongoose.model("VideoRoom", VideoRoomSchema);
