const mongoose = require('mongoose');

const resetPassTokenSchema = new mongoose.Schema({
    accessToken:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isValid:{
        type:Boolean,
        required:true 
    }   
},{
    timestamps:true
});

const ResetPassToken = mongoose.model('ResetPassToken',resetPassTokenSchema);
module.exports = ResetPassToken;