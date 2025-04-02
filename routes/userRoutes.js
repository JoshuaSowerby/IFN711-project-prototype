const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post('/updateUsername', async (req,res)=>{//again use authentication, aslo should likely be updateHistory
    try {
        //findOneAndUpdate(filter, update, optionss)
        await User.findOneAndUpdate(
            {userId: req.body.userId},//update to req.user.userId when auth in place
            {username: req.body.username},
            {upsert: true, new: true}//create if doesnt exist
        );
        res.status(201).send("updated");
    } catch (error) {
        res.status(400).send({error});
    };
});

module.exports = router;
