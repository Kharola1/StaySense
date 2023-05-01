const mongoose= require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
let userSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true
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
	email:  {
		type: String
		
	},
	phoneNumber : {
		type: Number,
		required:true
	}
});
userSchema.plugin(passportLocalMongoose);
let User = mongoose.model('user', userSchema);
module.exports = User;