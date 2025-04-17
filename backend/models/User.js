// should store unser data like settings, and username...
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth", required: true },
    username: {
        type: String
    },
    setting1:{
        type: Boolean
    }
});

/*
- if we allow adding friends, we should add a "friend code" to this, it would be like another id, but the user can see this code and send it to friends etc
    - would need to add friend list to this then,
    - would allow for friends leaderboard as opposed to just "global"
    - apparently letting people see MongoDB id's can be bad, so just hash something
    friend_code: {
        type: String,// hash id idk
        requried: true
    },
    friends: [
        {
            friends_code:{
                type: String,
                requried: true
            },
            friends_name:{
                type: String,
                requried: true
            }
            
        }
    ]


*/

module.exports = mongoose.model("User", userSchema);