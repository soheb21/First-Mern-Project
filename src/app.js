require('dotenv').config()
const express = require("express")
const app = express();
require("./db/conn")
const path = require("path")
const hbs = require("hbs")
const port = process.env.PORT || 3000
const Register_Data = require("./model/register")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const auth = require("../middleware/auth")
//css k liye 👇🏼
const public_path = path.resolve(__dirname, "../public")
app.use(express.static(public_path))
app.use(cookieParser())
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
app.get("/secret", auth, (req, res) => {
    // console.log(req.cookies.jwt)
    res.render("secret")

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
            const token = await registerEmployee.generateAuthToken();
            //The res.cookie() function is used tp set cookie name to value.
            //The value paramter may be string or object converted to json
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000), //ab 3min k baad cookie expired ho jaaega
                httpOnly: true
            });
            console.log(cookie)

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
        const isMatch = await bcrypt.compare(password, verifyUser.password)
        const token = await verifyUser.generateAuthToken();
        res.cookie("jwt", token);

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
//ye logout agar sirf ek device se logout krwana hai 👇🏼
app.get("/logout", auth, async (req, res) => {
    try {
        // res.clearCookie("jwt"); //isse logout tho ho jaaega phir bhi token DB m rhega 
        // req.user.tokens = req.user.tokens.filter((CurrElem) => {
        //     return CurrElem.token !== req.token;
        // })
        // console.log("logout Successfully!!")

        //logout from all devices
        req.user.tokens = []

        await req.user.save();
        res.render("login")
    } catch (error) {
        res.status(404).send(error)

    }
})

app.get("/about", (req, res) => {
    res.render("about")
})

// const jwt=require("jsonwebtoken")

// const createToken=async()=>{
//     const token= await jwt.sign({_id:"6415f96aea355de7bcadc57d"},"SECRET_KEY",{
//         expiresIn:"2 seconds"
//     })
//     console.log(token)

//     const userVerify=await jwt.verify(token,"SECRET_KEY")
//     console.log(userVerify)
// }
// createToken();

app.listen(port, () => console.log(`Connted with server at port no:${port}`))