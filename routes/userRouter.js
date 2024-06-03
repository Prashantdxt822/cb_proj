const express= require('express');
const { User, Ride, Journey } = require('../db');
const jwt= require("jsonwebtoken")
const {JWT_SECRET}=require('../config');
const { userCheck } = require('../middlewares/user');

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

router.use(userCheck);

router.put('/:id',async(req,res)=>{
    try {
        const userId= req.params.id;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).send({msg:"user doesnt exist"});
        }
        await User.findByIdAndUpdate(userId,req.body);
        return res.status(200).send({msg:"user details successfully updated!"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"internal server error"});
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
});

router.post('/journey/:id',async(req,res)=>{
    try {
        const {vehicle,address}=req.body;
        const userId=req.params.id;
        const user= await User.findById(userId);
        const ride= await Ride.findOne({vehicle});
        if(!user || !ride || ride.quantity==0){
            return res.status(400).send({msg:"sorry! the ride cannot be booked"});
        }
        if(user.walletBalance<ride.price){
            return  res.status(400).send({msg:"insufficient wallet balance!"});
        }
        else{
            const journey=await Journey.create({ride_id:ride._id,user_id:user._id,address});
            await Ride.findByIdAndUpdate(ride._id,{$inc:{quantity:-1}});
            await User.findByIdAndUpdate(userId,{$inc:{'walletBalance.amount':ride.price}});
            res.status(200).send({msg:"journey successfully created!",journeyId:journey._id});
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"internal server error!"})
    }
});

router.get('/journey/:id',async(req,res)=>{
    try {
        const userId=req.params.id;
        const allJourneys=await Journey.find({user_id:userId});
        return res.status(200).send({allJourneys});
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"internal server error!"});
    }
})

module.exports=router;