const mongoose= require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
let userSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	address:{
		type:String

	},

	username: {
		type: String,
		required:[true , 'You need to pass a username'],
		unique: true,
		trim:true
	},
	image:{
		type:String

	},
	phoneNumber : {
		type: Number,
		required:true
	},
	author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
});
userSchema.plugin(passportLocalMongoose);
let User = mongoose.model('user', userSchema);
module.exports = User;