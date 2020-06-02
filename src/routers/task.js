const express = require("express");
const tasks=require("../models/tasks");
const auth = require("../middlewares/auth");


const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
    //console.log("HI");
    const taskObject = {
        ...req.body,
        owner: req.user._id
    }
    const task=tasks(taskObject);
    await task.populate("owner").execPopulate();

    //async-await
    try{
        const taskSaved = await task.save();   //do not give tasks(ie the model name here to save, but the return value of the call to the task model after passing the object to be added)
        res.send(taskSaved)
    }
    catch(e){
        res.status(400).send(e);
    }

    //promise-chaining
    // task.save().then(result=> res.send(result))
    // .catch(error=> res.status(400).send(error));
})



router.get("/tasks",auth, async (req, res) => {
    // tasks.find().then(results=> res.send(results))
    // .catch(error => res.status(400).send(error));
    try{
        const task = await tasks.find({ owner: req.user._id });
        const match = {};
        const sort = {};
        //console.log("What is the params", req.query);  //!!REMEMBER- Its not req.params but req.query
        if(req.query.completed){
            //console.log("Hi");
            match.completed= req.query.completed === "true";
        }

        if(req.query.sortBy){
            const sortString = req.query.sortBy;
            const sortParams = sortString.split(":");

            sort[sortParams[0]] = sortParams[1];
        }
        //console.log(match);

        await req.user.populate({
            path: "task", //Here the value for the field path is the same as the one given for the virtual field. Its the virtual field name that we are trying to associate the tasks belonging to the user on the user object.
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: (parseInt(req.query.page)-1)*parseInt(req.query.limit),
                sort
            }
        }).execPopulate();   //Remember to user execPopulate along with populate.
        console.log("What is the value here", req.user.task);
        res.send(req.user.task);   //Here req.user.[param] should be the same as the virtual field name setup in the tasks Schema for mongoose and also given in the path field in the populate method object

    }
    catch(e){
        //console.log(e);
        res.status(400).send("Mo Banda")
    }
    


})

router.get("/tasks/:id",auth, async (req, res) => {
    //console.log("Hi");
    const _id = req.params.id;
    //console.log(req.user);

    //promise-chaining
    // tasks.findOne({ _id }).then(result=> res.send(result))
    // .catch(error => res.status(400).send(error));

    //async-await
    try{
        //console.log("in the try");
        //const task=await tasks.findById(_id); //Here if id is given instead of _id then catch block is exec but empty object is sent in error response
        const task = await tasks.findOne({ _id, owner: req.user._id });
        //console.log("after error");
        if(!task){
            return res.status(400).send("No task found by that ID");
        }
        res.send(task);
    }
    catch(e){
        //console.log("erro", typeof e); //typeof e obtained when gets reference error is object type and is not sent in the error response properly but is sent as {}
        res.status(400).json(JSON.stringify());
    }
})



router.patch("/tasks/:id", auth, async (req, res) => {
    const id = req.params.id;
    const updateBody= req.body;

    const allowedFields = ["description", "completed"];
    const updateRequestFields=Object.keys(updateBody);
    const isUpdateAllowed = updateRequestFields.every(field => allowedFields.includes(field));

    if(!isUpdateAllowed){
        return res.status(400).send("Invalid request: No such field found to update");
    }

    try{
        //const task = await tasks.findById(id);
        const task = await tasks.findOne({ _id: id, owner: req.user._id });
        if(!task){
            return res.status(400).send("No task found by that id");
        }
        //console.log(task);
        updateRequestFields.forEach(updateRequestField => {
            task[updateRequestField] = req.body[updateRequestField];
        });

        //console.log(task);

        const updatedTask = await task.save();
        //const updatedTask = await tasks.findByIdAndUpdate(id, updateBody, { new: true, runValidators: true});
        
        res.send(updatedTask);
    }
    catch(e){
        //console.log(e);
        res.status(400).send(e);
    }
})




router.delete("/tasks/:id",auth, async (req, res) => {
    const id = req.params.id;
    try{
        //const task = await tasks.findByIdAndDelete(id);
        const task = await tasks.findOneAndDelete({ _id: id, owner: req.user._id });
        if(!task){
            return res.status(400).send("No task found by the given id");
        }

        res.send(task);
    }
    catch(e){
        res.status(400).send(e);
    }
})


module.exports = router;