const express = require('express'),
	{ isLoggedIn, isReviewAuthor } = require('../middlewares/index');
const router = express.Router();
const Hotel = require('../models/hotel');
const Review = require('../models/review');
const User   = require('../models/user');

// create - newOverallRating = (old + curr)/hotel.reviews.length;
router.post('/hotels/:id/reviews', isLoggedIn, async (req, res) => {
	try {
		// make a new review and store it into db
		let newReview = new Review(req.body.review);
		newReview.author = req.user;
		await newReview.save();
		// take that review and push that into the hotel
		let hotel = await Hotel.findById(req.params.id);
		hotel.overAllRating = ((hotel.overAllRating*hotel.reviews.length) + newReview.rating)/(hotel.reviews.length+1);
		hotel.reviews.push(newReview);
		await hotel.save();
		// redirect somewhere
		req.flash('sucess', 'comment added');
		res.redirect(`/hotels/${req.params.id}`); // show page
	} catch (error) {
		req.flash('error', 'error while creating review, please try again later');
		console.log(error);
		res.redirect(`/hotels/${req.params.id}`);
	}
});


// delete
router.delete('/hotels/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
	try {
		await Review.findByIdAndDelete(req.params.reviewId);
		req.flash('success', 'comment deleted');
		res.redirect(`/hotels/${req.params.id}`);
	} catch (error) {
		req.flash('error', 'error while deleting review, please try again later');
		console.log(error);
		res.redirect(`/hotels/${req.params.id}`);
	}
});

module.exports = router;
