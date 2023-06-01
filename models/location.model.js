const mongoose=require("mongoose")

const locationSchema=mongoose.Schema({
    userID:String,
    location:String
})

const LocationModel=mongoose.model("location",locationSchema)

module.exports={
    LocationModel
}