const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req, res, next) => {
    try{
        //console.log(typeof req.headers); //req.headers is an object whose keys are the same as the keys defined in request headers on client side so can access the object keys using "." operator
        //console.log(typeof req.header); //req.header is a function to whom you can pass value which is equal to the keys set in the headers section of the request
        const token = req.header("authorization").replace("Bearer ", "");   //also can user req.headers.authorization
        const tokenDecoded = jwt.verify(token, "Unique");
        //console.log(tokenDecoded);
        const user = await User.findOne({ _id: tokenDecoded._id, "tokens.token": token })
        //console.log(token);
        req.user = user;
        req.token = token;
        //console.log("Where is this", req.route.path === "/users/login");
        if(!user){
            throw new Error();
        }
        if(req.route.path === "/users/login"){
            //console.log("HiHI");
            return res.status(202).send({ user:req.user.getPublicProfile(), token: req.token });
        }
        //console.log(req.route.path);
        next();
    }
    catch(e){
        if(req.route.path==="/users/login"){
            return next();
        }
        res.status(401).send("Unable to Authorize")
    }
}


module.exports = auth;