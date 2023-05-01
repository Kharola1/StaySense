const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotel');

router.get('/',(req,res)=>{
    res.render('landing');
});
router.get('/hotels', async(req,res)=>{
    try{
        let hotels = await Hotel.find({});
        res.render('hotels/index' , {hotels});

    }
    catch(err){
        req.flash('error' , 'error while fetching hotels');
        res.redirect('/');
    }
});

router.post('/hotel', async(req, res)=>{
        try {
            let newUser = new User({
                username: req.body.name,
                email: req.body.email,
                number: req.body.number
            });
            await newUser.save();
            res.redirect('/hotel');
        }
        catch (err) {
            console.log('Error while creating new Hotel');
        }
    });
module.exports = router;