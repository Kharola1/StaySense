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
        min: 500,
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
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    overAllRating: {
		type: Number,
		default: 0
	},
    reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'review'
		}
	],
});

const Hotel = mongoose.model('hotel' , hotelSchema);
module.exports = Hotel;