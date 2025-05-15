const User = require('../models/user.model'); // Adjust to your actual path
const bcrypt = require('bcrypt');

module.exports.findOrCreateUser = async (profile) => {
    console.log(profile)
    const user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
        return user;
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new User({
        username: profile.displayName,
        name: profile.displayName,
        password: hashedPassword, // Secure dummy password
        email: profile.emails[0].value,
        profileImage: profile.photos?.[0]?.value,
        isAccountVerified: true,
    });

    console.log('New user created:', newUser);

    await newUser.save();
    return newUser;
};
