const express= require('express');
const { User } = require('../db');
const jwt= require("jsonwebtoken")
const {JWT_SECRET}=require('../config')

const router=express.Router();

router.post('/signup',async(req,res)=>{
    const {username,password,firstName,lastName}= req.body;
    try {
        const user  = await User.findOne({username});
        if(user){
            res.status(401).send({msg:"user already exists"});
        }
        else{
             const createdUser=await User.create(req.body);
             const token= jwt.sign({userId:createdUser._id},JWT_SECRET);
             return res.status(200).send({token});
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"internal server error!"})
    }

})
router.get('/signin',async(req,res)=>{
    const {username,password}= req.body;
    try {
        const {username,password}=req.body;
        const user= await User.findOne({username});
        if(!user){
            res.status(401).send({msg:"User does not exist"});
        }
        const token= jwt.sign({userId:user._id},JWT_SECRET);
        res.status(200).send({msg:"successfully signed in!",token});
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"internal server error!"})
    }
})

router.get('/ride',async(req,res)=>{
    try {
        const allRides=await Ride.find({});
        res.status(200).send({allRides});
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"server has some internal error!"});
    }
})

router.put('/wallet/:id',async(req,res)=>{
    try {
        const {addAmount}=req.body;
        const userId=req.params.id;
        const timeDifference= new Date(Date.now()- 24*60*60*1000);
        
        const user=await User.findOneAndUpdate({
            _id:userId,
            'walletBalance.lastUpdated':{$lte:timeDifference}
        },{
            $inc:{'walletBalance.amount':addAmount},
            $set:{'walletBalance.lastUpdated':Date.now()}
        },{
            new:true
        });
        if(user){
            res.status(200).send({msg:"wallet topped up successfully!",amount:user.walletBalance.amount});
        }
        else{
            res.status(400).send({msg:"wallet top can be done only once in 24 hours.."});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:'internal server error...'});     
    }
})

module.exports=router;