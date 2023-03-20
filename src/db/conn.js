const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/registration_data")
.then(()=>console.log("MongoDB Connected..."))
.catch((err)=>console.log("Not Coonected",err))