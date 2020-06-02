const mongoose=require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTION_URL,{ //give the database name here to connect in the URL in case of Mongoose. If not provided then will create a DB with the given name and will create the collection name accordingly to the one given in the mongoose.models() first argument
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true

})