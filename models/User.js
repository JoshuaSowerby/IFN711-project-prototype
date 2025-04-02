// should store unser data like settings, and username...
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth", required: true },///fix this in the router section
    username: {
        type: String
    },
    setting1:{
        type: Boolean
    }
});

module.exports = mongoose.model("User", userSchema);