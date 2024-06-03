const jwt=require('jsonwebtoken');
const {JWT_SECRET_ADMIN}=require('../config');

async function adminCheck(req,res,next){
    const token=req.headers.authorization;
    if(!token || !token.startsWith("Bearer ")){
        return res.json({message:"admin not signed in "});
    }
    const jwtToken=token.split(" ")[1];
    try {
        const payload=jwt.verify(jwtToken,JWT_SECRET_ADMIN)
        req.adminId=payload.adminId;
        next();
    } catch (error) {
        console.log(error);
        res.json({messge:"admin is not logged in"});
    }
}

module.exports={
    adminCheck
};