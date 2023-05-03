const express = require('express'),
	{ isLoggedIn, isUserAuthor } = require('../middlewares/index');
const router = express.Router();
const User = require('../models/user');

router.get('/users/:id', isLoggedIn, async (req, res) => {
	try {
		let user = await User.findById(req.params.id);
		res.render('users/show', { user });
	} catch (error) {
		req.flash('error', 'error while fetching user, please try again later');
		console.log(error);
		res.redirect('/hotels');
	}
});
router.get('/users/:id/edit',isLoggedIn,isUserAuthor, async (req, res) => {
	try {
		let user = await User.findById(req.params.id);
		res.render('users/edit', { user });
	} catch (error) {
		req.flash('error', 'error while fetching user, please try again later');
		console.log(error);
		res.redirect('/hotels');
	}
});
router.patch('/users/:id', isLoggedIn, isUserAuthor, async (req, res) => {
	try {
		await User.findByIdAndUpdate(req.params.id, req.body.user);
		req.flash('success', 'User update done');
		res.redirect(`/users/${req.params.id}`);
	} catch (error) {
		req.flash('error', 'error while updating user, please try again later');
		console.log(error);
		res.redirect(`/users/${req.params.id}`);
	}
});
// router.delete('/users/:id';)

module.exports = router;
