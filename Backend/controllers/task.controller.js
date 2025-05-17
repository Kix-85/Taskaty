const Task = require("../models/task.model");
const Project = require("../models/project.model");
const { createComment, deleteComment } = require("./comment.controller");

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
    const { title, description, status, dueDate, project, assignedTo, progress, isRecurring, recurrencePattern } = req.body;
    const name = title;
    try {
        const existingTask = await Task.findOne({ name, project });
        if (existingTask) {
            return res.status(400).json({ message: 'Task with the same title already exists in this project' });
        }

        // 1. Check if project exists
        // const targetProject = await Project.findById(project);
        // if (!targetProject) {
        //     return res.status(404).json({ message: 'Project not found' });
        // }

        // // 2. Check if the user is the leader of the project
        // if (targetProject.leader.toString() !== userID) {
        //     return res.status(403).json({ message: 'Only the project leader can create tasks.' });
        // }

        const task = await Task.create({ name, description, status, dueDate, project, assignedTo, createdBy: userID, progress, isRecurring, recurrencePattern });

        await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

        res.status(201).json(task);
    } catch (error) {
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