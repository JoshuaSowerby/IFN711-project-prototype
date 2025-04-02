const express = require("express");
const router = express.Router();
const ExerciseHistory = require("../models/ExerciseHistory");


// should allow for queries
router.get('/getExerciseHistory', async (req,res)=>{//this should use authenticator middleware using JWT instead of needing userId
    try{
        const score = await ExerciseHistory.findOne({ userId: req.body.userId });//change to req.user._id once auth in place
        if (!score){
            return res.status(404).send({ message: "No score found" });
        }
        res.status(201).send("1");//{ score: score.score }
    }catch(error){
        res.status(400).send({error});
    };
});

// update history
// why does each score in the array have its own id?
router.post('/updateExerciseHistory', async (req,res)=>{//again use authentication, aslo should likely be updateHistory
    try {
        await ExerciseHistory.findOneAndUpdate(
            {userId: req.body.userId},//update to req.user.userId when auth in place
            {$push:{
                exercises:{
                    exercise: req.body.exercise,
                    points: req.body.points,
                    timestamp: req.body.timestamp}}},
            {upsert: true, new: true}//create if doesnt exist
        )
        res.status(201).send("updated");
    } catch (error) {
        res.status(400).send({error});
    };
});

module.exports = router;