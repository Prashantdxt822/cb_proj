
const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://dixitprashant2511:Patuboss%401603@cluster0.b1ilxoj.mongodb.net/cb_project");  

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    walletBalance:{
        amount:{
            type:Number,
            default :0
        },
        lastUpdated:{
            type:Date,
            default:Date.now()
        }
    }
});

const adminSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
});

const rideSchema=new mongoose.Schema({
    vehicle:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
});

const journeySchema= new mongoose.Schema({
        ride_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Journey",
            required:true
        },
        address:{
            type:String,
            required:true
        },
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
})


const User=mongoose.model('User',userSchema);
const Admin=mongoose.model('Admin',adminSchema);
const Journey=mongoose.model('Journey',journeySchema);
const Ride=mongoose.model('Ride',rideSchema);

module.exports={
    User,
    Admin,
    Journey,
    Ride
};