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
  origin: 'http://localhost:5173', 
  credentials: true               
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:5173/login');
    });
  });
});

const uploadRoute = require('./routes/uploadRoutes');
const userRoute = require('./routes/userroutes');
const segmentRoute = require('./routes/segmentRoutes');


app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/segment", segmentRoute);
// app.use("/api/v1/users", userRoute);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
