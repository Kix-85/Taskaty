const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
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
        enum: ['todo', 'in_progress', 'completed', 'archived'],
        default: 'todo'
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        required: false
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    subtasks: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    estimatedTime: {
        type: Number, // in minutes
        required: false
    },
    actualTime: {
        type: Number, // in minutes
        required: false
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrencePattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'none'],
        default: 'none'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ createdBy: 1, status: 1 });

const Task = mongoose.model("Tasks", taskSchema);
module.exports = Task; 