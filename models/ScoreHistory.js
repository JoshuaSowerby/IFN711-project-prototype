const mongoose = require("mongoose");

const scoreHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth", required: true },
    score: [{
        score: {
            type: Number,
            required: true},
        timestamp:{
            type: Date,
            default: Date.now}
        }]
});

module.exports = mongoose.model("ScoreHistory", scoreHistorySchema);