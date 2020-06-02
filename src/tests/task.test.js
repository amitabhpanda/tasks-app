const users = require("../models/users");
const tasks = require("../models/tasks");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");


const { userOne, userOneId, setupUserData, userTwo, userTwoId, taskOne } = require("./fixtures/db");

beforeEach(setupUserData);


test("Create a task with status 200", async () => {
    await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Test Task"
        })
        .expect(200);
    
    const task = await tasks.findOne({description: "Test Task"});
    expect(task.description).toBe("Test Task");
})


test("Get all tasks for the user One", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    //console.log("TESTING GET ALL TASKS", response.json());
    expect(response.body.length).toEqual(2);
})



test("Delete task for userOne by userTwo", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", userTwo.tokens[0].token)
        .send()
        .expect(400)

    const tasktobedeleted = await tasks.findById(taskOne._id);
    expect(tasktobedeleted).not.toBeNull();
})