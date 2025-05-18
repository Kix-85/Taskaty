const User = require('../models/user.model');

// Get user by ID
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw error;
    }
};

// Get user by email
const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw error;
    }
};

// Create new user
const createUser = async (userData) => {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

// Update user
const updateUser = async (userId, updateData) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
        return user;
    } catch (error) {
        throw error;
    }
};

// Delete user
const deleteUser = async (userId) => {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
}; 