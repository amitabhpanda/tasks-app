require("../src/db/mongoose");

const tasks=require("../src/models/tasks");

//Using promise chaining
/*
tasks.findOneAndDelete({_id: "5e4aac87692c072dc42b76a1"})
.then(result => {
    //console.log(result);
    return tasks.find({ completed: false});
})
.then(result=> //console.log(result))
.catch(error => //console.log(error));
*/


//Using Async-await

const deleteTaskAndCount = async (id) => {
    const deletedTasks= await tasks.findByIdAndDelete(id);
    const countAfterDelete = await tasks.countDocuments();
    //console.log("deleted task in async", deletedTasks);
    //console.log("count After delete", countAfterDelete);
    return countAfterDelete;
}


deleteTaskAndCount("5e4ac9d52ae997209c7845ab")
.then(count=> console.log(count));