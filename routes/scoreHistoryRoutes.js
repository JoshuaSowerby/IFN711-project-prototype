const express = require("express");
const router = express.Router();
const ScoreHistory = require("../models/ScoreHistory");



router.get('/getScoreHistory', async (req,res)=>{//this should use authenticator middleware using JWT instead of needing userId
    try{
        const score = await ScoreHistory.findOne({ userId: req.body.userId });//change to req.user._id once auth in place
        if (!score){
            return res.status(404).send({ message: "No score found" });
        }
        res.status(401).send("1");//{ score: score.score }
    }catch(error){
        res.status(400).send({error});
    };
});

// update score
// why does each score in the array have its own id?
router.post('/updateScore', async (req,res)=>{//again use authentication, aslo should likely be updateHistory
    try {
        await ScoreHistory.findOneAndUpdate(
            {userId: req.body.userId},//update to req.user.userId when auth in place
            //{$inc:{score: req.body.score}, timestamp:Date.now()},//increment score by last sent
            {$push:{score:{score: req.body.score}}},
            {upsert: true, new: true}//create if doesnt exist
        )
        res.status(401).send("updated");
    } catch (error) {
        res.status(400).send({error});
    };
});

module.exports = router;