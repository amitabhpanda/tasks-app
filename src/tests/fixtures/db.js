const users = require("../../models/users");
const tasks = require("../../models/tasks");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userOneId = mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: "First",
    age: 24,
    email: "first@gmail.com",
    password: "firstPass@123",
    tokens: [{
        token: jwt.sign({_id: userOneId}, "Unique")
    }]
}

const userTwoId = mongoose.Types.ObjectId();

const userTwo = {
    _id: userTwoId,
    name: "Second",
    age: 23,
    email: "second@gmail.com",
    password: "secondPass@123",
    tokens: [{
        token: jwt.sign({_id: userTwoId}, "Unique")
    }]
}

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    description: "Test Task 1",
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    description: "Test Task 2",
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    description: "Test Task 3",
    completed: false,
    owner: userTwoId
}


const setupUserData = async () => {
    await users.deleteMany({});
    await tasks.deleteMany({});

    await new users(userOne).save();
    await new users(userTwo).save();

    await new tasks(taskOne).save();
    await new tasks(taskTwo).save();
    await new tasks(taskThree).save();
}



module.exports = {
    setupUserData,
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne
}