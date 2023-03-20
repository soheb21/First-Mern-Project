const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const registerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                alert("please enter valid Email!!")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    cn_password: {
        type: String,
        required: true,
        trim: true
    },
    phn_no: {
        type: Number,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
registerSchema.methods.generateAuthToken = async function () { //methods use kr rhe becoz instance methods use hota h
    try {
        const token = await jwt.sign({ _id: this._id.toString() },process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token})
        console.log(`The tokkenid is ${token}`)
        await this.save();
        return token; //ab undefine nahi aaygea 
    } catch (error) {
        res.send("the error part:", error)
        console.log("the error part:" + error)
    }
}
registerSchema.pre("save", async function (next) {
    if (this.isModified("password")) { //agar password wala field kuch change ho tho like update/forget uske liye isModiefy() h.

        // console.log( this.password)
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(this.password)

        this.cn_password = await bcrypt.hash(this.password, 10);

    }
    next(); //mtlb passHash hogya h ab next kaam bascally save krna h hamara next kaam.
})

const Register_Data = new mongoose.model("Register_Data", registerSchema)
module.exports = Register_Data