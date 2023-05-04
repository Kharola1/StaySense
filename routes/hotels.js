const express = require('express'),
	 {isLoggedIn, isHotelAuthor} = require('../middlewares/index');
const router = express.Router();
const Hotel = require('../models/hotel');

// // ! cloud upload
// const multer = require('multer');
// const { storage } = require('../cloudinary/cloud_config');
// const upload = multer({ storage });

// ! mapbox
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

// // ! STRIPE PAYMENT
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', (req, res) => {
	res.render('landing');
});

router.get('/hotels', async (req, res) => {
	 try {
		let hotels = await Hotel.find({}); 
		res.render('hotels/index' , { hotels });
	} catch (error) {
		req.flash('error', 'error while fetching hotels, please try again later');
		console.log(error);
		res.redirect('/');
	}
});

router.get('/hotels/new', isLoggedIn, (req, res) => {
	res.render('hotels/new');
});

router.post('/hotels', isLoggedIn, async (req, res) => {
	try {
		let hotel = new Hotel(req.body.hotel);
		hotel.author = req.user._id;

		// //* file upload using multer & cloudinary
		// for (let file of req.files) {
		// 	hotel.images.push({
		// 		url: file.path,
		// 		filename: file.filename
		// 	});
		// }
		// * geocoding using mapbox
		const geoData = await geoCoder
			.forwardGeocode({
				query: req.body.hotel.address,
				limit: 1
			})
			.send();
		// console.log(geoData.body.features[0].geometry.coordinates);
		hotel.geometry = geoData.body.features[0].geometry;

		await hotel.save();
		req.flash('success', 'hotel created');
		res.redirect(`/hotels/${hotel._id}`);
	} catch (error) {
		req.flash('error', 'error while creating hotel, please try again later');
		console.log(error);
		res.redirect('/hotels');
	}
});

router.get('/hotels/:id', async (req, res) => {
	try {
		let hotel = await Hotel.findById(req.params.id)
			.populate({
				path: 'author'
			})
			.populate({
				path: 'reviews',
				populate: {
					path: 'author'
				}
			});
			let coordinates = hotel.geometry.coordinates;
			res.render('hotels/show', { hotel, coordinates });
	} catch (error) {
		req.flash('error', 'error while fetching a hotel, please try again later');
		console.log(error);
		res.redirect('/hotels');
	}
});

router.get('/hotels/:id/edit', isLoggedIn, isHotelAuthor, async (req, res) => {
	try {
		let hotel = await Hotel.findById(req.params.id);
		res.render('hotels/edit', { hotel });
	} catch (error) {
		req.flash('error', 'error while fetching a hotel, please try again later');
		console.log(error);
		res.redirect('/hotels');
	}
});

router.patch('/hotels/:id', isLoggedIn, isHotelAuthor, async (req, res) => {
	try {
		await Hotel.findByIdAndUpdate(req.params.id, req.body.hotel);
		console.log(req.body);
		req.flash('success', 'update done');
		res.redirect(`/hotels/${req.params.id}`);
	} catch (error) {
		req.flash('error', 'error while updating a hotel, please try again later');
		console.log(error);
		res.redirect('/hotels');
	}
});

router.delete('/hotels/:id', isLoggedIn, isHotelAuthor, async (req, res) => {
	try {
		await Hotel.findByIdAndDelete(req.params.id);
		req.flash('success', 'delete done');
		res.redirect('/hotels');
	} catch (error) {
		req.flash('error', 'error while deleting a hotel, please try again later');
		console.log(error);
		res.redirect('/hotels');
	}
});

// router.get('/hotels/:id/upvote', isLoggedIn, async (req, res) => {
// 	try {
// 		// check if user has already liked - remove the like
// 		const { id } = req.params;
// 		const hotel = await Hotel.findById(id);
// 		const upvoteExists = await Hotel.findOne({
// 			_id: id,
// 			upvotes: req.user._id
// 		});
// 		const downvoteExists = await Hotel.findOne({
// 			_id: id,
// 			downvotes: req.user._id
// 		});
// 		if (upvoteExists) {
// 			const hotel = await Hotel.findByIdAndUpdate(id, {
// 				$pull: { upvotes: req.user._id }
// 			});
// 			console.log('removed like');
// 			res.redirect(`/hotels/${req.params.id}`);
// 		} else if (downvoteExists) {
// 			// toggle user from downvotes array to upvotes array
// 			const hotel = await Hotel.findByIdAndUpdate(id, {
// 				$pull: { downvotes: req.user._id },
// 				$push: { upvotes: req.user._id }
// 			});
// 			console.log('removed your dislike and added a like');
// 			res.redirect(`/hotels/${req.params.id}`);
// 		} else {
// 			hotel.upvotes.push(req.user);
// 			await hotel.save();
// 			console.log('added like');
// 			res.redirect(`/hotels/${req.params.id}`);
// 		}
// 	} catch (error) {
// 		req.flash('error', 'error while adding a like, please try again later');
// 		console.log(error);
// 		res.redirect(`/hotels/${req.params.id}`);
// 	}
// });
// router.get('/hotels/:id/downvote', isLoggedIn, async (req, res) => {
// 	try {
// 		// check if user has already liked - remove the like
// 		const { id } = req.params;
// 		const hotel = await Hotel.findById(id);
// 		const upvoteExists = await Hotel.findOne({
// 			_id: id,
// 			upvotes: req.user._id
// 		});
// 		const downvoteExists = await Hotel.findOne({
// 			_id: id,
// 			downvotes: req.user._id
// 		});
// 		if (upvoteExists) {
// 			// toggle user from upvotes array to downvotes array
// 			const hotel = await Hotel.findByIdAndUpdate(id, {
// 				$pull: { upvotes: req.user._id },
// 				$push: { downvotes: req.user._id }
// 			});
// 			console.log('removed your like and added a dislike');
// 			res.redirect(`/hotels/${req.params.id}`);
// 		} else if (downvoteExists) {
// 			const hotel = await Hotel.findByIdAndUpdate(id, {
// 				$pull: { downvotes: req.user._id }
// 			});
// 			console.log('removed dislike');
// 			res.redirect(`/hotels/${req.params.id}`);
// 		} else {
// 			hotel.downvotes.push(req.user);
// 			await hotel.save();
// 			console.log('added dislike');
// 			res.redirect(`/hotels/${req.params.id}`);
// 		}
// 	} catch (error) {
// 		req.flash('error', 'error while adding a like, please try again later');
// 		console.log(error);
// 		res.redirect(`/hotels/${req.params.id}`);
// 	}
// });
// router.get('/seed', async (req, res) => {
// 	try {
// 		for (let i = 0; i < 50; i++) {
// 			let hotel = new Hotel({
// 				name: 'Hotel HighRise',
// 				geometry: {
// 					type: 'Point',
// 					coordinates: [ 77.2090057, 28.6138954 ]
// 				},
// 				address: 'delhi',
// 				price: 10000,
// 				images: [
// 					{
// 						url:
// 							'https://res.cloudinary.com/diabrsvd6/image/upload/v1680943889/StaySense/hhbi8z180wk5okktrmy6.jpg',
// 						filename: 'StaySense/hhbi8z180wk5okktrmy6'
// 					}
// 				],
// 				upvotes: [],
// 				downvotes: []
// 			});
// 			hotel.author = req.user;
// 			await hotel.save();
// 		}
// 		res.send('done');
// 	} catch (error) {
// 		console.log(error);
// 	}
// });
// router.get('/hotels/:id/checkout/success', (req, res) => {
// 	res.send('payment done');
// });
// router.get('/cancel', (req, res) => {
// 	res.send('error while paying for hotel');
// });
// router.get('/hotels/:id/checkout', isLoggedIn, async (req, res) => {
// 	const hotel = await Hotel.findById(req.params.id);
// 	const session = await stripe.checkout.sessions.create({
// 		payment_method_types: [ 'card' ],
// 		customer_email: req.user.username,
// 		line_items: [
// 			{
// 				price_data: {
// 					currency: 'inr',
// 					product_data: {
// 						name: hotel.name,
// 						description: hotel.address,
// 						images: [ hotel.images[0].url ]
// 					},
// 					unit_amount: hotel.price * 100
// 				},
// 				quantity: 1
// 			}
// 		],
// 		mode: 'payment',
// 		success_url: `${process.env.URL_SERV}/hotels/${hotel._id}/checkout/success`,
// 		cancel_url: 'http://localhost:3000/cancel'
// 	});
// 	res.redirect(session.url);
// });

module.exports = router;
