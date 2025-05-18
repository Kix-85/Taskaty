const Task = require("../models/task.model");
const Project = require("../models/project.model");
const { createComment, deleteComment } = require("./comment.controller");
const mongoose = require("mongoose");

module.exports.getMyTasks = async (req, res) => {
    const userID = req.user.id;
    try {
        const tasks = await Task.find({
            $or: [
                { assignedTo: userID },
                { createdBy: userID },
            ]
        })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('project', 'name logo description status activity dueDate teamMembers leader')
            .populate('comments.user', 'name email avatar')
            .sort({ createdAt: -1 });

        if (!tasks) {
            return res.status(404).json({ message: 'No tasks found' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getTask = async (req, res) => {
    const taskId = req.params.taskID;
    try {
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
            console.log("Task is not found")
            return res.status(404).json({ success: false, message: "Task is not found" })
        }
        console.log("Task is found")
        res.status(200).json(task);

    } catch (error) {
        console.log("Internal server error from (getTask controller): ", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
};

module.exports.createTask = async (req, res) => {
    const userID = req.user.id;
    const { title, name, description, status, priority, dueDate, project, assignedTo, progress, isRecurring, recurrencePattern } = req.body;
    
    // Use title if provided, otherwise use name
    const taskName = title || name;
    
    if (!taskName) {
        return res.status(400).json({ message: 'Task title/name is required' });
    }

    try {
        const existingTask = await Task.findOne({ name: taskName, project });
        if (existingTask) {
            return res.status(400).json({ message: 'Task with the same title already exists in this project' });
        }

        const taskData = {
            name: taskName,
            description,
            status: status || 'todo',
            priority: priority || 'medium',
            dueDate,
            project,
            assignedTo,
            createdBy: userID,
            progress: progress || 0,
            isRecurring,
            recurrencePattern
        };

        const task = await Task.create(taskData);

        if (project) {
            await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });
        }

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateTask = async (req, res) => {
    const taskID = req.params.taskID;
    const { name, description, status, dueDate, project, assignedTo, progress, isRecurring, recurrencePattern } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(taskID, { name, description, status, dueDate, project, assignedTo, progress, isRecurring, recurrencePattern }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Project.findByIdAndUpdate(project, { $addToSet: { tasks: task._id } }, { new: true });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.getTasksByProject = async (req, res) => {
    const projectID = req.params.projectID;
    try {
        const tasks = await Task.find({ project: projectID })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('project', 'name logo description status activity dueDate teamMembers leader')
            .populate('comments.user', 'name email avatar')
            .sort({ createdAt: -1 });

        if (!tasks) {
            return res.status(404).json({ message: 'No tasks found for this project' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getTasksByUser = async (req, res) => {
    const userID = req.params.userID;
    try {
        const tasks = await Task.find({ assignedTo: userID })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('project', 'name logo description status activity dueDate teamMembers leader')
            .populate('comments.user', 'name email avatar')
            .sort({ createdAt: -1 });

        if (!tasks) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteTask = async (req, res) => {
    const taskID = req.params.taskID;
    try {
        const task = await Task.findByIdAndDelete(taskID);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.createComment = createComment;
module.exports.deleteComment = deleteComment;

// Subtask operations
module.exports.createSubtask = async (req, res) => {
    const taskId = req.params.taskID;
    const { title, description } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const newSubtask = {
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            completed: false
        };

        task.subtasks.push(newSubtask);
        await task.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateSubtask = async (req, res) => {
    const { taskID, subtaskID } = req.params;
    const updates = req.body;

    try {
        const task = await Task.findById(taskID);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const subtaskIndex = task.subtasks.findIndex(st => st._id.toString() === subtaskID);
        if (subtaskIndex === -1) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        task.subtasks[subtaskIndex] = {
            ...task.subtasks[subtaskIndex],
            ...updates
        };

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteSubtask = async (req, res) => {
    const { taskID, subtaskID } = req.params;

    try {
        const task = await Task.findById(taskID);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.subtasks = task.subtasks.filter(st => st._id.toString() !== subtaskID);
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};