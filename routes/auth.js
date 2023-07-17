const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
//REGISTER

router.post("/register",async (req,res) =>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPass,
        });
        console.log(newUser)
        const user = await newUser.save();
        console.log("User is " + user)
        res.status(200).json(user);
    } 
    catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN

router.post("/login",async (req,res)=>{
    try{
        console.log(req.body)
        const user = await User.findOne({username:req.body.username});
        console.log(user);
        if(!user) res.status(400).json("wrong credentials!");
         
        const validated = await bcrypt.compare(req.body.password,user.password);
        !validated && res.status(400).json("wrong credentials, not validated!");
        
        const{password,...others} =user._doc;
    

        res.status(200).json(others);
     
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports =router