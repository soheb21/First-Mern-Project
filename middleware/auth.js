const jwt = require("jsonwebtoken")
const Register_Data = require("../src/model/register")


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; //get the token id from the cookie
        const verify = await jwt.verify(token, process.env.SECRET_KEY)
        const user = await Register_Data.findOne({ _id: verify._id })
        console.log(user.firstname)
        req.user=user;
        req.token=token;
    } catch (err) {
        res.status(400).send(err)
    }
    next();
}
module.exports = auth;