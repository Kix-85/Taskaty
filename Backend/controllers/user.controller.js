const User = require('../models/user.model');

module.exports.searchUser = async (req, res) => {
    try {
        const search = req.query.search;
        const users = await User.find({
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        });
        res.status(200).send({ success: true, data: users, message: "Users fetched successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error searching users", error: error.message });
    }
}

module.exports.getMyProfile = async (req, res) => {
    const userId = req.user.id;
    console.log("From the user user controller: ", req.user);
    console.log("From the id user controller: ", userId);
    try {
        const user = await User.findById(userId);
        console.log("From the user user controller after fetch: ", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user, message: 'User profile fetched successfully' });
    } catch (error) {
        console.error("Error fetching user profile: ", error);
        res.status(500).json({ success: false, message: 'Error fetching user profile', error: error.message });
    }

}

module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        // Fetch the full Mongoose user document
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // If there's a file uploaded, use the Cloudinary URL
        if (req.file) {
            console.log('File uploaded to Cloudinary:', req.file);
            // Cloudinary stores the URL in the path property
            if (req.file.path) {
                updates.profileImage = req.file.path;
            } else {
                console.error('No file path received from Cloudinary');
                return res.status(500).send({
                    success: false,
                    message: "Error uploading profile image"
                });
            }
        }

        // Apply the updates
        Object.assign(user, updates);
        await user.save();

        // Return the complete user object
        const updatedUser = await User.findById(userId);
        res.status(200).send({
            success: true,
            data: updatedUser,
            message: "Profile updated successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};

module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        res.status(200).send({ success: true, data: user, message: "User fetched successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error fetching user", error: error.message });
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userID);
        Object.assign(user, req.body);
        await user.save();
        res.status(200).send({ success: true, data: user, message: "User updated successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error updating user", error: error.message });
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userID);
        res.status(200).send({ success: true, data: user, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error deleting user", error: error.message });
    }
}