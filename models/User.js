const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  name: String,
  image: String,

  abilities: [String],        // skills you have
  learnSkills: [String],      // skills you want to learn

  education: String,
  hobbies: [String],

  experience: String,

  // rating: {
  //   type: Number,
  //   default: 0,
  //   min: 0,
  //   max: 5
  // },

  rating: {
  type: Number,
  default: 0   // will store AVERAGE
}


  

}, { timestamps: true });

module.exports =
  mongoose.models.User || mongoose.model("User", UserSchema);
