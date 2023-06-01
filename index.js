const express=require("express")
const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.route")
const { apiRouter } = require("./routes/wather.route")
require("dotenv").config()
const cors=require("cors")



const app=express()
app.use(express.json())
app.use(cors())

app.use("/users",userRouter)
app.use("/api",apiRouter)

app.get("/",(req,res)=>{
    res.status(200).send("Home Route")
})

app.get("*",(req,res)=>{
    res.status(404).send("Page Not found")
})


app.listen(process.env.port,async ()=>{
    try {
        await connection
        console.log("Connected to DB")
        
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running on ${process.env.port}`)
})