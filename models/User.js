// should store unser data like settings, and username...
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth", required: true },///fix this in the router section
    userName: {
        type: String
    },
    setting1:{
        Boolean: true
    }
});

module.exports = mongoose.model("User", userSchema);