const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: "String",
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }

},{
    timestamps: true
})

usersSchema.virtual('task', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
})

usersSchema.methods.getPublicProfile = function(){
    const user = this;
    //console.log("getPublicProfile-received user", user);
    const userObject = user.toObject();
    //console.log("getPublicProfile-user Object", userObject);
    delete userObject.tokens;
    delete userObject.password;
    //console.log("getPublicProfile-user post deletion", userObject);
    return userObject;
}

usersSchema.methods.generateAuthToken = async function(){  // this is like a method of the class usersModel which we define here. this method is part of individual instance created from the userModel class and will be called from the individual
    const user = this;                                      // object, so it will have access to this word which refers to the current user instance which has called this  function which we are storing as user variable and 
                                                            // changing its properties like a regular object and saving it to MDB using  user.save()
                                                            // I was doing usersModel.save() which is meaningless as the save() is an object method and not a static class method. and we save individual instances so no meaning of calling it from the class
    const token = jwt.sign( { _id: user._id.toString() }, "Unique");
    //console.log( token );
    user.tokens = user.tokens.concat({ token }); // it was throwing concat method not defined since was using userModels variable here which is absolutely absurd. Here we are trying to work on the individual object calling thisfunction. We are trying to generate Jwt and store in individual object under the tokens key.

    await user.save();
    //console.log("Hi");
    return token;
}

usersSchema.statics.verifyCredentials = async (email, password) => {
    //console.log("dhoashd");
    const user = await usersModel.findOne( { email } );

    //console.log("user",user);
    if(!user){
        throw new Error("No user found by that email id");
    }
    const matching = await bcrypt.compare(password, user.password);
    //console.log(matching);
    if(matching){
        //console.log("HIiii")
    
        return user;
    }
    throw new Error("Password not Matching");


}

usersSchema.pre("save", async function(next){
    const user = this;
    //console.log("balaaaaa");
    if(user.isModified("password")){
        //console.log("achvadf");   //Here this code will run if there is a password field given for update and only if the value of the field has changed from the one stored in DB and will not run even if the field is there but the value is same
        user.password = await bcrypt.hash(user.password, 8);  // and since password here is stored in hash form, it will run this since even if we give same password as before it is still different from the hashed version stored in the DB which is good since in real scenario, passwords get updated even if we give the same password like in forgot password. Or this validation we can provide on our own and Mongoose validator wont work as we cannot use bcrypt to check if the password update is same as the old one.
    }

    next();
})

const usersModel = mongoose.model("users", usersSchema);


module.exports = usersModel;