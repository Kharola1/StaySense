const mongoose = require('mongoose');
const hotelSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    price:{
        type: Number,
        required:true,
        min: 100,
        max: 10000
    },

    isRoomAvailable: {
        type: Boolean,
        default:true
    },
    image: {
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

});

const Hotel = mongoose.model('hotel' , hotelSchema);
module.exports = Hotel;