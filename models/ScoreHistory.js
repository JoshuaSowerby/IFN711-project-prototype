const mongoose = require("mongoose");

const scoreHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", required: true },///fix this in the router section
    score: [{
        score: {
            type: Number,
            required: true},
        timestamp:{
            type: Date,
            default: Date.now}
        }]
});

module.exports = mongoose.model("Score", scoreHistorySchema);