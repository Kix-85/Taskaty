const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findOrCreateUser } = require('../services/findOrCreateUser');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateUser(profile);
            return done(null, user); 
        } catch (error) {
            return done(error, null);
        }
    }
));

module.exports = passport;