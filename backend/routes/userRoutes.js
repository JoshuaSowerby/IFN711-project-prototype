const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const excludedFields={userId:0,_id:0,__v:0};//.select(excludedFields)


router.get('/', authMiddleware, async (req,res) => {
    try {
        const user = await User.findOne({userId: req.userId}).select(excludedFields);
 
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error});
    }
});


router.post('/updateUsername',authMiddleware, async (req,res)=>{
    try {
        //findOneAndUpdate(filter, update, optionss)
        await User.findOneAndUpdate(
            {userId: req.userId},
            {username: req.body.username},
            {upsert: true, new: true}//create if doesnt exist
        );
        res.status(201).send("updated");
    } catch (error) {
        res.status(400).send({error});
    };
});

module.exports = router;
