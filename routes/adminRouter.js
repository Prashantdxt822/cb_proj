
const express=require('express');
const { Admin, Ride } = require('../db');
const router=express.Router();


router.post('/signup',async(req,res)=>{
    const {username,password,firstName,lastName}= req.body;
    try {
        const admin = await Admin.findOne({username});
        if(admin){
            res.status(401).send({msg:"user already exists"});
        }
        else{
             const createdAdmin=await Admin.create(req.body);
             const token= jwt.sign({userId:createdAdmin._id},JWT_SECRET);
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
        const admin= await Admin.findOne({username});
        if(!admin){
            res.status(401).send({msg:"User does not exist"});
        }
        const token= jwt.sign({userId:admin._id},JWT_SECRET);
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

router.post('/ride',async(req,res)=>{
    try {
        const {vehicle,quantity,price}=req.body;
        const ride= await Ride.findOne({vehicle});
        if(ride){
            res.status(400).send({msg:"ride already exists"});
        }
        await Ride.create(req.body);
        return res.status(200).send({msg:"ride created!"});
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"server has some internal error!"});
    }
})

router.put('/ride/:id',async(req,res)=>{
    try {
        const rideId=req.params.id;
        const ride=await Ride.findById(rideId);
        if(!ride){
            return res.status(400).send({msg:"ride doesnt exist"});
        }
        await Ride.findOneAndUpdate(rideId,req.body);
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"server has some internal error!"});
    }
});

router.delete('/ride/:id',async(req,res)=>{
    try {
        await Ride.findByIdAndDelete(req.params.id);
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"server has some internal error!"});
    }
});


module.exports=router;