const calculateBill = (bill, tipPercentage = 0.25) => {
    const tip = bill * tipPercentage;
    const totalBill = bill + tip;
    //console.log(totalBill);
    return totalBill;
}

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const asyncAdd = (num1, num2) => {
    let sum = 1;
    return new Promise((resolve, reject) => {
        try{
            setTimeout(() => {
                sum = num1 + num2;
                //console.log(sum);
                resolve(sum);
            },4000);
        }
        catch(e){
            reject(e);
        }
        
    });
}

asyncAdd(-1, 5).then(sum => {
    //console.log("sum in math", sum);
})

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!


module.exports = {
    calculateBill,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    asyncAdd
}