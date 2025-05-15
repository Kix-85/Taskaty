const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

module.exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=error&reason=user-not-found`);
        }

        if (user.isAccountVerified) {
            return res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=already-verified`);
        }

        user.isAccountVerified = true;
        await user.save();

        return res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=success`);

    } catch (error) {
        console.log("Error: ", error.message);
        return res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=error&reason=invalid-or-expired-token`);
    }
};
