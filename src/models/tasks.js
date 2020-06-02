const mongoose = require("mongoose");


const tasksSchema=mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },

    completed: {
        type: Boolean,
        default: false,
        trim: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
},{
    timestamps: true
});


const tasksModel=mongoose.model("tasks", tasksSchema);


module.exports= tasksModel;