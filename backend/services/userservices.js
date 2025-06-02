const usermodel = require('../models/usermodel');

module.exports.createUser = async ({ googleId, displayName, email, avatar, role, companyName }) => {
    if (!googleId || !displayName || !email || !role || !companyName) {
        throw new Error('Please fill in all required fields');
    }
    const user = await usermodel.create({
        googleId,
        displayName,
        email,
        avatar,
        role,
        companyName
    });
    return user;
};