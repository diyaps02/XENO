const User = require('../models/usermodel');


// Get current user profile (for authenticated user)
exports.getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
   res.json({
    displayName: req.user.displayName,
    email: req.user.email,
    companyName: req.user.companyName,
    avatar: req.user.avatar,
    role: req.user.role,
    googleId: req.user.googleId,
    _id: req.user._id
  });
};


exports.createUser =async (req, res) => {
 if (!req.user) return res.status(401).send("Unauthorized");
   
 console.log("Req:",req.body);
  const { companyName, role } = req.body;


  User.findByIdAndUpdate(req.user._id, { companyName, role }, { new: true })
    .then(updatedUser => res.json(updatedUser))
    .catch(err => res.status(500).json({ error: 'Update failed', details: err }));
    }
