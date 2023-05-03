const express           = require('express')
      ejs               = require('ejs'),
      mongoose          = require('mongoose'),
      session           = require('express-session'),
      flash             = require('connect-flash'),
      passport          = require('passport'),
      localStrategy     = require('passport-local'),
      methodOverride    = require('method-override'),
      path              = require('path');
    

const app = express();
require('dotenv').config();

// Mongoose connection
mongoose.connect('mongodb+srv://rahulkharola111:rahulkharola111@hotel.vsrhibe.mongodb.net/?retryWrites=true&w=majority' )
.then(() => {
    console.log('Database is Connected');
})
.catch((err) => {
    console.log('Error while connecting to Database');
});

// session setup
const SESSION_PASS = process.env.SESSION_PASS;
app.use(
    session({
        secret: SESSION_PASS,
        resave: true,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure: true,
            expires: Date.now() + 1000 * 60 * 60 * 24,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

const User = require('./models/user');
// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middlewares
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname,+'public'));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Import router/API
const authRoutes = require('./routes/auth'),
      hotelRoutes = require('./routes/hotels'),
      userRoutes = require('./routes/users');
      reviewRoutes = require('./routes/reviews');

app.use(authRoutes);
app.use(hotelRoutes);
app.use(userRoutes);
app.use(reviewRoutes);

// Port connection
let PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('Server is connected '+ PORT);
});
