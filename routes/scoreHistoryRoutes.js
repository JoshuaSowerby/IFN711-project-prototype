const express = require("express");
const router = express.Router();
const ScoreHistory = require("../models/ScoreHistory");
const Leaderboard = require("../models/Leaderboard");
//const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");



const excludedFields={userId:0,_id:0,__v:0};//.select(excludedFields)


//add queries
//should we remove the _id from all scores?
router.get('/',authMiddleware, async (req,res)=>{
    try{
        const score = await ScoreHistory.findOne({ userId: req.userId });
        if (!score){
            return res.status(404).send({ message: "No score found" });
        }
        res.status(201).send(score).select(excludedFields);//{ score: score.score }
    }catch(error){
        res.status(400).send({error});
    };
});

// update score
router.post('/updateScore',authMiddleware, async (req,res)=>{
    try {
        //findOneAndUpdate(filter, update, optionss)
        await ScoreHistory.findOneAndUpdate(
            {userId: req.userId},
            //{$inc:{score: req.body.score}, timestamp:Date.now()},//increment score by last sent
            {$push:{score:{score: req.body.score}}},
            {upsert: true, new: true}//create if doesnt exist
        )

        // update leaderboard
        // 2 options, either find username based off userId, or have them send it. for now we will go with the former, but the latter may be more efficient
        //const user=await User.findOne({userId:req.userId});
        // dont add username to leaderboard, find it whenever we get scoreboard, so changes in username are always accounted for
        // that may be a bad idea, adding to scoreboard is less involved
        await Leaderboard.findOneAndUpdate(
            {userId: req.userId},
            {score: req.body.score},
            //{score: req.body.score, username:user.username},
            {upsert:true, new: true}

        )
        res.status(201).send("updated");
    } catch (error) {
        res.status(400).send({error});
    };
});

module.exports = router;