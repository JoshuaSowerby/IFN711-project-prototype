// THe idea of this is that it only stores the most recent scoreHistory value, I dont know if it should do that
// only get is needed, post wold be in update score history

const express = require("express");
const router = express.Router();
const Leaderboard = require("../models/Leaderboard");
const mongoose = require("mongoose");


// should allow for queries
// remove user id from return
// get user ID using JWT
router.get('/', async (req,res)=>{//this should use authenticator middleware using JWT instead of needing userId
    try{
        
        let query={};//query object
        //greater than
        if (req.query.lessThanOrEqual){
            query.score = { ...query.score, $lte: Number(req.query.lessThanOrEqual)};
        }
        if (req.query.greaterThanOrEqual){
            query.score = { ...query.score, $gte: Number(req.query.greaterThanOrEqual)};
        }
        if (req.query.id){
            if(!mongoose.Types.ObjectId.isValid(req.query.id)){
                return res.status(400).json({error: 'Invalid id'});
            }
            query.userId=new mongoose.Types.ObjectId(`${req.query.id}`)//id should always be a str anyway, this just removes depreciated warning
        }
        //limit
        // surrounding
        const leaderboard = await Leaderboard.find(query).sort({score:1})
        res.status(200).send(leaderboard);//shouldnt send with id, should just be username, not implemented
    }catch(error){
        res.status(400).send({error});
    };
});

module.exports = router;