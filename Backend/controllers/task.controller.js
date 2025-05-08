const Task = require("../models/task.model");
const Project = require("../models/project.model");

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

module.exports.createTask = async (req, res) => {
    const userID = req.user.id;
    const { title, description, status, dueDate, project, assignedTo, progress, isRecurring, recurrencePattern } = req.body;
    try {
        const existingTask = await Task.findOne({ title, project });
        if (existingTask) {
            return res.status(400).json({ message: 'Task with the same title already exists in this project' });
        }

        // 1. Check if project exists
        const targetProject = await Project.findById(project);
        if (!targetProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // 2. Check if the user is the leader of the project
        if (targetProject.leader.toString() !== userID) {
            return res.status(403).json({ message: 'Only the project leader can create tasks.' });
        }

        const task = await Task.create({ title, description, status, dueDate, project, assignedTo, createdBy: userID, progress, isRecurring, recurrencePattern });

        await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateTask = async (req, res) => {
    const taskID = req.params.taskID;
    const { title, description, status, dueDate, project, assignedTo, progress, isRecurring, recurrencePattern } = req.body;
    try {
        const task = await Task.findByIdAndUpdate(taskID, { title, description, status, dueDate, project, assignedTo, progress, isRecurring, recurrencePattern }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Project.findByIdAndUpdate(project, { $addToSet: { tasks: task._id } }, { new: true });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
