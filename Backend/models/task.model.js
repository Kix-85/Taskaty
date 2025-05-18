const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: {
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
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false
    },
    status: {
        type: String,
        required: true,
        enum: ['todo', 'in progress', 'done'],
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
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    subtasks: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: false,
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
            ref: 'User',
            required: false
        },
        content: {
            type: String,
            required: false,
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