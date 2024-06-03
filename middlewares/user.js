const { JWT_SECRET } = require("../config");
const jwt=require('jsonwebtoken');

async function userCheck(req,res,next){
    try {
        const token= req.headers.authorization;
        if(!token || !token.startsWith("Bearer ")){
            return res.json({message:"user not logged in "});
        }
        const jwtToken=token.split(" ")[1];
        const payload= jwt.verify(jwtToken,JWT_SECRET);
        req.userId=payload.userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg:"user not logged in"});
    }
}

module.exports={
    userCheck
}