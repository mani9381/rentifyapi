const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const {userModel} = require('./models/user')
const middleware = require('./middleware/middleware')
const {postModel} = require('./models/property')

const app = express()
app.use(cors()) // allow all ip to access this server 
app.use(express.json()) // to parse the data from frontend
const uri = 'mongodb://host:27017' // DB connecting uri


mongoose.connect(uri)
.then(()=>{
    console.log("Data base connected...")
})
.catch(()=>{console.error("Error while connecting to Db ")})

app.get('/',(req,res)=>{
    res.json({message:"Hello world"})
})


app.post('/register',async (req,res)=>{
    try{
        let {firstName,lastName,phone, email,password} = req.body;
        let user_phone = await userModel.findOne({email:email})
        if(user_phone){
            return res.status(200).json({message:"user already exists with this email"})
        }
        let user_email = await userModel.findOne({phone:phone})
        if(user_email){
            return res.status(200).json({message:"user already exists with this phone number"})
        }
        let doc = new userModel({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password,
            phone:phone
        })
        await doc.save()
        return res.status(200).json({message:"Registered Successfully"})

    }
    catch(err){
        
        return res.status(500).json({message:"internal server error"})
    }
})

app.post('/login',async (req,res)=>{
    try{
        let{email,password} = req.body;
        let user = await userModel.findOne({email:email,password:password})
        if(user){
            return res.status(404).json({auth:false,message:"User not found with details or wrong password"})
        }
        let payload = {
            userId:{
                id:user._id
            }   
        }
        let token =  jwt.sign(payload,"SeCreaTElkf2938jfhgfkdbj8",{expiresIn:"1d"})
        return res.status(200).json({auth:true,token:token})
    }
    catch(err){
        return res.status(500).json({message:"internal server error"})
    }
})

app.post('/createProperty',middleware,async(req,res)=>{
    try{
        let {place,area,nobeds,nobaths,nhosp,ncoll} = req.body;
        let doc = new postModel({
            place:place,
            area:area,
            nearCollege:ncoll,
            nearHospital:nhosp,
            bathroomsCount:nobaths,
            bedroomsCount:nobeds,
            likes:0,
            ownerId:req.user.id
        })
        await doc.save()
        return res.status(200).json({message:"Property created successfully"})

    }
    catch(err){
        return res.status(500).json({message:"internal server error"})
    }

})

app.post('/allProperties',middleware,async(req,res)=>{
    try{
        let data = await postModel.find({})
        return res.status(200).json(data)
    }
    catch(err){
        return res.status(500).json({message:"internal server error"})
    }
})

app.put('/updateLikes',middleware,async (req,res)=>{
    try{
        let {postId} = req.body;

        await postModel.updateOne({_id:mongoose.Types.ObjectId(postId)},{$inc:{likes:1}})
        return res.status(200).json({message:"Liked.."})
    }
    catch(err){
        return res.status(500).json({message:"internal server error"})
    }
})

app.delete('/deleteProperty',async(req,res)=>{
    try{
        let {postId} = req.body;
        await postModel.deleteOne({_id:mongoose.Types.ObjectId(postId)})
        return res.status(200).json({message:"Deleted perminently..."})
    }
    catch(err){
        return res.status(500).json({message:"internal server error"})
    }
})


app.listen(5000,()=>{
    console.log("Server listening on port: 5000");
})  
