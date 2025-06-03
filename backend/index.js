const express = require('express');
const connectDB = require('./db/db');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./auth/google');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;


connectDB();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{ secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: "https://mini-messanger04.onrender.com", 
  credentials: true               
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const redirectTo = req.session.redirectTo || '/dashboard';
    delete req.session.redirectTo;
    res.redirect(`https://mini-messanger04.onrender.com${redirectTo}`);
  }
);
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.redirect('/google-logout');
    });
  });
});


const uploadRoute = require('./routes/uploadRoutes');
const segmentRoute = require('./routes/segmentRoutes');
const userRoutes = require('./routes/userroutes');
const campaignRoutes = require('./routes/campaignRoutes');


app.use('/users', userRoutes);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/segment", segmentRoute);
app.use("/api/v1/campaign", campaignRoutes);
// app.use("/api/v1/users", userRoute);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
