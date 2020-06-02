//const express=require("express");

//require("./db/mongoose");
const tasks=require("./models/tasks");
const users=require("./models/users");
const userRouters= require("./routers/user");
const taskRouters = require("./routers/task");

//const app = express();

const app = require("./app");

//console.log("app", app);

// app.use(express.json());
// app.use(userRouters);
// app.use(taskRouters);

/*
const main = async function(){
    // const task = await tasks.findById("5e554b2c7aaf5a1eb4a5cd51");
    // const taskPopulated = await task.populate("owner").execPopulate();
    // //console.log(task);
    // //console.log("HIIHIIHIHII");
    // //console.log(taskPopulated);

    const user = await users.findById("5e53ede1cb108c5708ba5dee");
    const userPopulated = await user.populate("task").execPopulate();   //no need of assigning as the mongoose methods act on the calling object itself and change it
    //console.log(user.task);         //same Here,the field is not populated in the db nor in the mongoose object ie the task property wont print on the user object but the tasks will print if we use user.task
    ////console.log("SEPARATE");        //However in case of real field like that for the task object, there also only the owner ObjectId will only be stored in DB but Mongoose will store the entire object if we run populate on the task object and it will print the entire owner object along with task object.
    ////console.log(userPopulated.task); //same
    ////console.log(user); //will not print the tasks as its not a property on it actually(in DB) but exists on the object and will print if we call it explicitly(user.task).
}

main()
*/




// app.listen(process.env.PORT || 3000, ()=> {
//     //console.log("Listening to requests");
// })


app.listen(4000, ()=> {
    //console.log("Listening to requests");
})