
// authentication
const isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		console.log('You are not logged in, Please Login');
		res.redirect('/login');
	}
};
// authorization
// const isAdmin = function(req, res, next) {
// 	if (req.user && req.user.isAdmin) {
// 		next();
// 	} else {
// 		return res.send('you dont have permission to do that');
// 	}
// };

 
// const isHotelAuthor = async (req, res, next) => {
// 	let { id } = req.params;
// 	let hotel = await Hotel.findById(id).populate('author');
// 	if (hotel.author._id.equals(req.user._id)) {
// 		next();
// 	} else {
// 		req.flash('error', 'you are not permitted to do that');
// 		res.redirect('back');
// 	}
// };

module.exports = {
	isLoggedIn,
    // isHotelAuthor
};
