const express = require("express");
const users=require("../models/users");
const tasks=require("../models/tasks");
const auth = require("../middlewares/auth");
const multer = require("multer");

const upload = multer({
    //dest: "avatar",  removing this in order to pass the processed image file to the route handlers
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error("Not a .doc file be Bala"))
        }

        cb(undefined, true);

    }
})



const router = new express.Router();


router.post("/users", async (req, res) => {
    const user = users(req.body);
    console.log(req.body);

    //async-await
    try{
        const userSaved = await user.save();

        const token = await user.generateAuthToken();
        //console.log(token);
        res.send({user: userSaved, token});
    }
    catch(e){
        res.status(400).send(e);
    }

    //promise-chaining
    // user.save().then(result=> res.send(result))
    // .catch(error => res.status(400).send(error));
})

router.post("/users/login", auth, async (req, res) => {
    try{
        const user = await users.verifyCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken(); // do not forget to mark this as await as this is also a long running task which should be defined as async since in this Jwt token is generated and added to user instance(object) and saved by calling user.save() which is asynchronous
        //console.log("what is the token", token); // it will return a promise if no await keyword is there, await keyword simply converts a returned promise with resolved value to the actual value
        res.send({ user: user.getPublicProfile(), token });
    }
    catch(e){
        //console.log(e);
        res.status(400).send("Not able to login. Please check email and password");
    }
})

router.get("/users/logout", auth, async (req, res) => {
    const user = req.user;
    user.tokens = user.tokens.filter(token => {
        return token.token!==req.token});
    await user.save();
    res.send("user logged out successfully")
})

router.get("/users/logoutAll", auth, async (req, res) => {
    req.user.tokens=[];
    await req.user.save();
    res.send("user logged out from All Devices successfully");
})

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user.getPublicProfile());
    //promise-chaining
    // users.find().then(result => res.send(result))
    // .catch(error => //console.log(error));

    //async-await
    // try{
    //     const usersInDB= await users.find();
    //     if(!usersInDB){
    //         return res.status(400).send("No users found");
    //     }
    //     res.send(usersInDB);
    // }
    // catch(e){
    //     //console.log(e);
    //     res.status(400).send(e);
    // }
})


// router.get("/users/:id", (req,res) => {
//     const _id=req.params.id;
//     //console.log(_id);
//     users.findById(_id).then(user => res.send(user))
//     .catch(error => res.status(400).send(error));
// })  //No longer needed to have this route since a user should be able to fetch only his own profile and not needed by Id since it wil be fetched once he logs in and also should
        //not be able to get other users profile.


router.patch("/users/update", auth, async (req, res) => {
    //console.log("is it");
    //const id = req.user._id;      No need for id property now once we put the auth middleware and update if authorized.
    const updateRequestBody= req.body;
    const updateFields=Object.keys(updateRequestBody);
    const allowedFields=["name", "email", "age", "password"];

    const isUpdateAllowed = updateFields.every(field => allowedFields.includes(field));
    //console.log(isUpdateAllowed);
    if(!isUpdateAllowed){
        console.log("Hi There");
        return res.status(400).send("Not a valid update request since the given field is not present");
    }
    console.log("Hi There");
    try{

        updateFields.forEach(updateField => {
            req.user[updateField] = req.body[updateField];
        })

        const updatedUser = await req.user.save();
        //const updatedUser = await users.findByIdAndUpdate(id, updateRequestBody, { new: true, runValidators: true});
        //console.log(updatedUser);
        // if(!updatedUser){
        //     return res.status(400).send("No user found by given id");
        // } //No longer needed to check if user is there or not since the user is already there and it is already found out in the auth middleware.
        res.send(updatedUser);
    }
    catch(e){
        //console.log(e);
        res.status(500).send(e);
    }

})


router.delete("/users/me", auth, async (req, res) => {  //give /users/:id instead of users/:id
    try{
        //Delete tasks first
        const deletedTasks = await tasks.deleteMany({ owner: req.user._id});
        //console.log("What are the deleted tasks", deletedTasks);
        const deletedUser = await req.user.remove();                
        //const deletedUser = await req.user.remove();
        // const user = await users.findByIdAndDelete(id);
        // if(!user){
        //     res.status(400).send("No user found by the given id");
        // }
        res.send(deletedUser);
    }
    catch(e){
        //console.log("error in delete", e);
        res.status(500).send(e);
    }
})

router.post("/users/me/avatar", auth, upload.single("avatar"), (req, res) => {
    req.user.avatar = req.file.buffer;
    req.user.save();
    res.send();
},(error, req, res, next) => { //implementing the last argument being passed to the route function which should be the error handler function and the error argument should be there as first argument to tell that its an Error handler.
    if(error){                  //else the middleware upload will send an Html as response by default and we have to add this if we want to 
        res.status(400).send({personalMsg:"Not valid file type be Balua", error: error.message});
    }
})

router.get("/users/:id/avatar", async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    try{
        const user = await users.findById(id);
        //console.log(user);
        if(!user || !user.avatar){
            throw new Error("Getting error");
        }

        res.set("Content-Type", "image/jpg");
        res.send(user.avatar);
    }
    catch(e) {
        res.status(400).send(e);
    }
    
})



router.delete("/users/me/avatar", auth, async (req, res) => {
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }
    catch(e){
        res.status(500).send("Error occured");
    }
    
})


module.exports = router;

/*{
	"email": "vicky@gmail.com",
	"password": "Password"
}*/