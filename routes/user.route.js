const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { UserModel } = require("../models/user.model")

const userRouter=express.Router()

userRouter.get("/",(req,res)=>{
    res.send("All Good")
})

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password}=req.body
    try {
        let user= await UserModel.find({email})
        if(user.length===0){
            bcrypt.hash(password,5,async (err,hash_password) => {
                if(err){
                   console.log(err)
                }else{
                   let user=new UserModel({name,email,gender,password:hash_password})
                   await user.save()
                   res.status(201).send({"msg":"User Register Sucessfully"})
                }
           }) 
           
        }else{
            res.send("Email id already registered.")
        }
    } catch (error) {
        console.log(error)
        res.send("Error while registering the user.")
    }
})

userRouter.post("/login",async (req,res)=>{
    let {email,password}=req.body
    try {
        let user=await UserModel.find({email})
        if(user.length!=0){
            let hash_password=user[0].password
            bcrypt.compare(password,hash_password,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID:user[0]._id},process.env.key)
                    res.send({"msg":"Login Sucessful",token})   
                }else{
                    console.log(err)
                    res.send({"msg":"Wrong Credentials"})
                }
            })

        }else{
            res.send({"msg":"Wrong Credentials"})
        }
        
    } catch (error) {
        console.log("Error while Logging in")
        console.log(error)
        res.send({"msg":"Error while logging in"})
    }
})



module.exports={
    userRouter
}