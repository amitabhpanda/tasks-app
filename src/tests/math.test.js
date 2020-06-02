const { calculateBill, fahrenheitToCelsius, celsiusToFahrenheit, asyncAdd } = require("../math");


test("Test total Bill with tip", () => {
    expect(calculateBill(10, 0.3)).toBe(13);
});


test("Test total bill with default tip value", () => {
    expect(calculateBill(10)).toBe(12.5);
});

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!

test("Should convert 32 F to 0 C", () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
})

test("Should convert 0 C to 32 F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
})

// test("Test async add if -1 and 5 returns 4",(done) => {
//     asyncAdd(-1, 5).then(sum=>{
//         expect(sum).toBe(4);
//         done();
//     });
// })

//NOTE:- In the above code we are trying to get the result of an asynch functin
// and only once we get that we will run our code to check if test is passed.
// But if we receive the done parameter in the function passed to test(),
// But we do not call it then it will keep running and will timeout after 5 secs
// with error message.
// And if we dont receive or call done() then the function will run normally.
// and since the function doesnt throw any error, the test function will assume.
// it ran successfully and will pass the test ie it will behave in sync manner.
// and will not support asynchronous nature of the function being called.

// So to support asynch nature we need to call the done function in the .then() function
// where we wait for the async func addAsynch() to finish execution and return 
// us the result. So at the end we need to put the done() call and the test will
// wait for the done() to be called and only then it will know that testing is 
// finished. And the done will be called only when the async function finishes
// executing after  setTimeout and returns the resolved promise which is received
// in the function passed in the .then() function to execute.


// Or else we can use async await function which helps us to await the async func
// results and then do the testing which makes everything look asynch and clean.

//Async await is actually supported by Jest so that it understands whenever, they
// are used to wait and run the tests asynchronously.

//even in case of Promise.then() also we need to receive and call done() to make
// the test be asynchronous.

// NOW Implementing using Async-Await

test("Async testing of add of -1 and 5 to give 4 using async-await", async () => {
    const sum = await asyncAdd(-1, 5);
    //console.log("HI");
    expect(sum).toBe(4);
    //console.log("HIHIIHIIH");
})




//test