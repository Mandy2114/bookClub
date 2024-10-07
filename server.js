const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

//app.use(express.static(path.join(__dirname, 'public')));

const authController = require('./controllers/auth.js');
const clubController = require('./controllers/club.js');

const port = process.env.PORT ? process.env.PORT : '3000';

const path = require('path');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); 

app.get('/', (req, res) => {
  if (req.session.user) {
    // [TBU] check if logged in user has a club, if so go to that page, if not render "make club"
    res.redirect(`/clubs/noClub`);
  } else {
    res.render('index.ejs');
  }
});


app.use('/auth', authController);
app.use(isSignedIn); 
app.use('/clubs', clubController); 


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
