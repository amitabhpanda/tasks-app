const app = require("../app");
const users = require("../models/users");
const { setupUserData, userOneId, userOne } = require("./fixtures/db");


////console.log(app);
const request = require("supertest");


beforeEach(setupUserData);


test("Test user Post return status code", async () => {
    const response = await request(app).post('/users').send({
        "email": "isforagainandagain@gmail.com",
        "password": "badri",
        "name": "badri",
        "age": 56
    }).expect(200);

    // console.log("USER POST TEST", response.body);

    expect(response.body.user.name).toBe("badri");

    expect(response.body.user.password).not.toBe("badri");


});


test("Testing login with userOne", async () => {
    const response = await request(app).post("/users/login").send({email: userOne.email,
    password: userOne.password}).expect(200);
    //console.log(response.body.user._id);
    const user = await users.findById(response.body.user._id);
    //console.log(user);
    //console.log(response.body.token);
    expect(user.tokens[1].token).toBe(response.body.token);
})

//Challenge
test("Testing with invalid credentials", async () => {
    await request(app).post("/users/login").send({ email: userOne.email,
    password: "TestAmi"}).expect(400);
})


//Challenge with authentication

test("Get user with authentication", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", userOne.tokens[0].token)
        .send()
        .expect(200);
})



test("Test deletion with response of status 200", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await users.findById(userOneId);
    console.log(user);
    expect(user).toBeNull();
})


test("Test deletion without authentication respone status 401", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})


test("Upload Pic and get 200 response", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "./src/tests/fixtures/profile-pic.jpg")
        .expect(200);
    
})


test("Should update valid user fields", async () => {
    await request(app)
        .patch("/users/update")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Amitabh",
        })
        .expect(200)
    
        const user = await users.findById(userOneId);

        expect(user.name).toBe("Amitabh");
    
})


test("Should not update invalid user fields", async () => {
    const response = await request(app)
        .patch("/users/update")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "bomikhal",
            name: "Amitabh"
        })
        .expect(400)

    console.log(response.text);
})
