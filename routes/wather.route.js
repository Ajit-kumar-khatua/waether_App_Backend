const express=require("express")
const fetch=require("node-fetch")
const { LocationModel } = require("../models/location.model")
const { authenticate } = require("../middleware/authenticate.middleware")
require("dotenv").config()

const apiRouter=express.Router()

apiRouter.get("/weather",async (req,res)=>{
    let { location }= req.query
    //   location=location.replace(/"/g,'')
    try {
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.apiKey}`)
        let data= await response.json()
        res.status(200).send(data)
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Error while getting weather Data")
    }

})

apiRouter.post("/preference",authenticate,async(req,res)=>{
    let {userID,location}=req.body
    try {
        let userPreferences= await LocationModel.find({userID})

        for(let userPreference of userPreferences){
            if(userPreference.location==="location"){
                res.send({"msg":"Location already Saved"})
               return
            }
        }
        
        await LocationModel.insertMany({userID,location})
        res.status(200).send({"msg":"Location Saved sucessfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Error while saving user location preference")
    }
})

apiRouter.get("/preference",authenticate,async (req,res)=>{
    let {userID}=req.body
    try {
        let locations=await LocationModel.find({userID})
        res.status(200).send(locations)
        
    } catch (error) {
        console.log(error)
        res.send("Error While getting User preferences")
    }
})

apiRouter.get("/forecast",async (req,res)=>{
    let {location}=req.query
   try {
    let response= await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.apiKey}`)
    let data=await response.json()
    res.status(200).send(data)
   } catch (error) {
    console.log(error)
    res.status(500).send("Error while getting weather Data")
   }
})



module.exports={
    apiRouter
}