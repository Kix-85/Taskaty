const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    logo : {
        type: String,
        required: false,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        required: true,
        enum: ['not_started', 'in_progress', 'done', 'just_started'],
        default: 'not_started'
    },
    activity: [{
        type: String,
        required: false,
        trim: true,
        maxlength: 1000,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    lastViews : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: false
    }],
    dueDate: {
        type: Date,
        required: false
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;