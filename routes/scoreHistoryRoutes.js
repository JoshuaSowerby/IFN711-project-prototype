const express = require("express");
const router = express.Router();
const ScoreHistory = require("../models/ScoreHistory");
const Leaderboard = require("../models/Leaderboard");
const authMiddleware = require("../middleware/authMiddleware");

/*
{userId: req.body.userId} //update to req.user.userId when auth in place
*/

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
router.post('/updateScore',authMiddleware, async (req,res)=>{//again use authentication, aslo should likely be updateHistory
    try {
        //findOneAndUpdate(filter, update, optionss)
        await ScoreHistory.findOneAndUpdate(
            {userId: req.userId},//update to req.user.userId when auth in place
            //{$inc:{score: req.body.score}, timestamp:Date.now()},//increment score by last sent
            {$push:{score:{score: req.body.score}}},
            {upsert: true, new: true}//create if doesnt exist
        )
        await Leaderboard.findOneAndUpdate(
            {userId: req.userId},
            {score: req.body.score},
            {upsert:true, new: true}

        )
        res.status(201).send("updated");
    } catch (error) {
        res.status(400).send({error});
    };
});

module.exports = router;