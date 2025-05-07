const { jwt } = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.changePassword = async (req, res) => {
    const {token} = req.query;
    const { newPassword, confrimPassword } = req.body;

    if(!newPassword || !confrimPassword && newPassword !== confrimPassword) {
        return res.status(400).json({success: false, message: "Please provide new password and confirm password"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded.id});

        if(!user) {
            console.log("User is not found (From changePass controller)")
            return res.status(404).json({success: false, message: "User not found"});
        }

        user.password = newPassword;
        await user.save();

        console.log("Password changed successfully");
        return res.status(200).json({success: true, message: "Password changed successfully"});

    } catch (error) {
        console.log("Error from changePass controller: ", error.message);
        res.status(500).json({success: false, message: 'Internal Server Error from changePass controller'})
    }
}