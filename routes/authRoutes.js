const express = require("express");
const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");
const router = express.Router();

// registerUser
// should add something for email confirmation
router.post('/registerUser', async (req,res)=>{
    // create user
    try{
        const user = new Auth(req.body);
        await user.save();
        res.status(201).send({user});
    }catch(error){
        res.status(400).send(error.message);
    };
});

router.post('/loginUser', async (req,res)=>{
    try {
        const {email, password} = req.body;
        const user= await Auth.findWithLogin(email,password);
        
        if(!user){
            return res.status(401).send({error: 'invalid login'});
        };
        res.status(200).send({user});//shouldnt I send the JWT instead
    } catch (error) {
        res.status(400).send({error: error.message});
    };
});

module.exports = router;