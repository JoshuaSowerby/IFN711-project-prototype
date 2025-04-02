// THe idea of this is that it only stores the most recent scoreHistory value, I dont know if it should do that
// only get is needed, post wold be in update score history

const express = require("express");
const router = express.Router();
const Leaderboard = require("../models/Leaderboard");


// should allow for queries
router.get('/getLeaderboard', async (req,res)=>{//this should use authenticator middleware using JWT instead of needing userId
    try{
        const leaderboard = await Leaderboard
        res.status(200).send(Leaderboard);//shouldnt send with id, should just be username, not implemented
    }catch(error){
        res.status(400).send({error});
    };
});
