// list all exercise done, is there a pint in seperating this fro scoreHistory?
const mongoose = require("mongoose");

const exerciseHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth", required: true },///fix this in the router section
    exercises: [{
        exercise: {
            type: String, // or this may reference another table with all exercises
            required: true},
        points: {
            type: Number,// how many points were earnt, could add more details but not now
            required: true
        },
        timestamp:{
            type: Date,
            default: Date.now}
        }]
});

module.exports = mongoose.model("ExerciseHistory", exerciseHistorySchema);
