const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    bio: {
        type: String,
        required: false,
        trim: true,
        maxlength: 200
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    googleId: {
        type: String,
        required: false, // Not required for normal signup
        sparse: true,
    },

    birthDate: {
        type: Date,
        required: false,
        // min: 6,
        // max: 100,
    },
    profileImage: {
        type: String,
        required: false,
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects'//Team
    }],
    // preferences: {
    //     notifications: {
    //         enabled: { type: Boolean, default: true },
    //         email: { type: Boolean, default: true },
    //         push: { type: Boolean, default: true },
    //         taskReminders: { type: Boolean, default: true }
    //     },
    //     theme: {
    //         type: String,
    //         enum: ['light', 'dark', 'system'],
    //         default: 'system'
    //     },
    //     timezone: {
    //         type: String,
    //         default: 'UTC'
    //     },
    //     language: {
    //         type: String,
    //         default: 'en'
    //     }
    // },
    statistics: {
        tasksCompleted: {
            type: Number,
            default: 0
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    settings: {
        type: Object,
        required: false,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
userSchema.index({ status: 1 });
userSchema.index({ 'statistics.lastActive': -1 });

const User = mongoose.model("User", userSchema);
module.exports = User;