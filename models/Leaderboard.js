const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth", required: true },///fix this in the router section
    userName:{
        type: String,
        ref: "User"
    },
    score: {
        type: Number, // should it be a reference to most recent score in score history
        required: true}
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);