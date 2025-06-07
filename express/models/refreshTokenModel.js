const mongoose = require('mongoose');


const refreshTokenSchema = new mongoose.Schema(
  {
    token: String,
    tokenExpires: Date,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);


const refreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = refreshToken ;
