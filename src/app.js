require('dotenv').config()
const express = require("express")
const app = express();
require("./db/conn")
const path = require("path")
const hbs = require("hbs")
const port = process.env.PORT || 3000
const Register_Data = require("./model/register")
const bcrypt = require("bcrypt")
console.log(process.env.SECRET_KEY)
//css k liye 👇🏼
const public_path = path.resolve(__dirname, "../public")
app.use(express.static(public_path))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "hbs")

const dynamic_path = path.join(__dirname, "../templates/views")
const partial_path = path.join(__dirname, "../templates/partials")

app.set("views", dynamic_path)
hbs.registerPartials(partial_path);

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cnpassword = req.body.cn_password;
        if (password === cnpassword) {
            const registerEmployee = new Register_Data({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                cn_password: req.body.cn_password,
                phn_no: req.body.phn_no,
                age: req.body.age,
                gender: req.body.gender
            })
            //middleware
            const token =await registerEmployee.generateAuthToken();
           
            const result = await registerEmployee.save();
            console.log(result)
            res.render("index")
        } else {
            res.send("password is not matching")
        }
    } catch (error) {
        res.status(404).send(error)
    }
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const verifyUser = await Register_Data.findOne({ email: email })
        // console.log(verifyUser)
        const isMatch=await bcrypt.compare(password,verifyUser.password)
        const token =await verifyUser.generateAuthToken();
        console.log(`login token is :${token}`)
        if (isMatch) {
            res.status(201).render("index");//ki hum direct index/homepage m redirect ho
        }
        else {
            res.send("invalid login Details")
        }

    } catch (error) {
        res.status(404).send(error)
    }
})

app.get("/about", (req, res) => {
    res.render("about")
})

// const jwt=require("jsonwebtoken")

// const createToken=async()=>{
//     const token= await jwt.sign({_id:"6415f96aea355de7bcadc57d"},"mynameisshoebsamiahmedansari",{
//         expiresIn:"2 seconds"
//     })
//     console.log(token)

//     const userVerify=await jwt.verify(token,"mynameisshoebsamiahmedansari")
//     console.log(userVerify)
// }
// createToken();

app.listen(port, () => console.log(`Connted with server at port no:${port}`))