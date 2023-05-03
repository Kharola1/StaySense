const Hotel = require('../models/hotel'),
      User = require('../models/user'),
	  Review = require('../models/review');

// authentication
const isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.session.originalUrl = req.originalUrl;
		console.log('You are not logged in, Please Login');
		res.redirect('/login');
	}
};
// authorization

const isUserAuthor = async (req, res, next) => {
	let { id } = req.params;
	if (id === req.user._id.toString()) {
	  next();
	} else {
	  req.flash('error', 'You are not authorized to perform this action.');
	  res.redirect('back');
	}
  };
  
const isReviewAuthor = async (req, res, next) => {
	let { reviewId } = req.params;
	let review = await Review.findById(reviewId).populate('author');
	if (review.author._id.equals(req.user._id)) {
		next();
	} else {
		req.flash('error', 'you are not permitted to do that');
		res.redirect('back');
	}
};
  

 
const isHotelAuthor = async (req, res, next) => {
	let { id } = req.params;
	let hotel = await Hotel.findById(id).populate('author');
	if (hotel.author._id.equals(req.user._id)) {
		next();
	} else {
		req.flash('error', 'you are not permitted to do that');
		res.redirect('back');
	}
};

module.exports = {
	isLoggedIn,
    isHotelAuthor,
	isUserAuthor,
	isReviewAuthor 
};
