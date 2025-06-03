const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/usermodel'); 
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user._id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }
    // Create new user if not found
    const email = profile.emails[0].value;

    
    user = await User.create({
      googleId: profile.id,
      displayName: profile.displayName,
      email: email,
      avatar: profile.photos[0]?.value,
      companyName: 'ZUDIO', // Default empty, will be updated later
      role: 'manager' // Default empty, will be updated later
    });
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
