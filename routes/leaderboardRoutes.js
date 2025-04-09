// THe idea of this is that it only stores the most recent scoreHistory value, I dont know if it should do that
// only get is needed, post wold be in update score history

const express = require("express");
const router = express.Router();
const Leaderboard = require("../models/Leaderboard");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

const excludedFields={userId:0,_id:0,__v:0};

// should allow for queries
// remove user id from return
// get user ID using JWT
/*
should return list of objects sorted by score and tell you which one you are
the objects must have a score field
they may have a username and ranking field
the username field will either be found from the "users" table or be in the "leaderboards" table
*/
router.get('/',authMiddleware, async (req,res)=>{
    try{
        
        //queries no longer used
        let query={};//query object
        //greater than
        if (req.query.lessThanOrEqual){
            query.score = { ...query.score, $lte: Number(req.query.lessThanOrEqual)};
        }
        if (req.query.greaterThanOrEqual){
            query.score = { ...query.score, $gte: Number(req.query.greaterThanOrEqual)};
        }

        //this is old and can likely be deleted
        // if (req.query.id){
        //     if(!mongoose.Types.ObjectId.isValid(req.query.id)){
        //         return res.status(400).json({error: 'Invalid id'});
        //     }
        //     query.userId=new mongoose.Types.ObjectId(`${req.query.id}`)//id should always be a str anyway, this just removes depreciated warning
        // }

        //limit

        // this should probably be its own route
        // surrounding
        // get ordered list
        // find 
        const leaderboard = await Leaderboard.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId', // userId in Leaderboard
                    foreignField: 'userId', // userId in User
                    as: 'user'
                }
            },
            { $unwind: '$user' }, // stops username from being a list
            { $sort: { score: -1 } },
            {
                $project: {
                    _id: 0,
                    userId: '$userId',
                    score: 1,
                    username: '$user.username'
                }
            }
          ]);
          const userIndex = leaderboard.findIndex(item => item.userId.toString()===req.userId);
          
          const noIdLeaderboard = leaderboard.map(({ userId, ...allItems }) => allItems);
          /*limit should look like this, but + and -5 should depend on length of leader board and position of userIndex
          const limit = req.query.limit;
          
          firstIndex=userIndex-limit;
          lastIndex=userIndex+limit;
          length=(leaderboard.length-1);

          if (lastIndex>length){// if lastIndex is greater than length of list, subtract the remainder to firstIndex, if firstIndex becomes -ve, set to 0
            firstIndex-=lastIndex-length;
            //lastIndex=length;//doesnt matter as slice works for greater than length
          };
          if (firstIndex<=0){//if firstIndex is negative or 0 add the leftover limit to the last
            lastIndex-=(limit+firstIndex);//firstIndex is 0 or -ve
            firstIndex=0;//set to 0 to avoid errors
          };
          
          return [...leaderboard.slice(firstIndex,userIndex),...leaderboard.slice(userIndex,lastIndex)]
          */

        //const leaderboard = await Leaderboard.find(query).sort({score:1}).select(excludedFields);
        res.status(200).send({leaderboard:noIdLeaderboard,userIndex});//shouldnt send with id, should just be username, not implemented
    }catch(error){
        res.status(400).send({error});
    };
});

module.exports = router;