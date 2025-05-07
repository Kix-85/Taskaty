const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js')


module.exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        user.isAccountVerified = true;
        await user.save();

        res.status(200).json({ success: true, message: 'Account verified successfully' });

    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).send('Internal Server Error: (verify controller): Invalid or Expired Token')
    }
}