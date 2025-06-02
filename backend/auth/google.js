const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/usermodel'); 
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id); 
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
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const email = profile.emails[0].value;
    const domain = email.split('@')[1];
    const companyName = domain; 

    const newUser = await User.create({
      googleId: profile.id,
      displayName: profile.displayName,
      email: email,
      avatar: profile.photos[0]?.value,
      companyName: companyName,
      role: 'owner' 
    });

    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));