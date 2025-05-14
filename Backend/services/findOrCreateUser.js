const User = require('../models/User'); // Adjust to your actual path

const findOrCreateUser = async (profile) => {
    const user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
        return user;
    }

    const newUser = new User({
        username: profile.displayName,
        name: profile.displayName,
        password: null, // Password is not needed for OAuth users
        email: profile.emails[0].value,
        profileImage: profile.photos[0].value,
        isAccountVerified: true,
    });

    await newUser.save();
    return newUser;
};
