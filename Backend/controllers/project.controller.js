const Project = require('../models/project.model');

module.exports.getMyProjects = async (req, res) => {
    const userID = req.user.id;
    try {
        const projects = await Project.find({ 
            $or: [
                {leader: userID},
                {teamMembers: userID},
            ]})
        .populate('teamMembers', 'name email')
        .populate('leader', 'name email')
        .populate('tasks')

        if (!projects) {
            return res.status(404).json({ message: 'No projects found' });
        }

        projects.sort((a, b) => {
            const aLastView = a.lastViews.find(view => view.toString() === userID);
            const bLastView = b.lastViews.find(view => view.toString() === userID);
            return (bLastView ? bLastView.Date : 0) - (aLastView ? aLastView.Date : 0);
        });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getProject = async (req, res) => {
    const projectID = req.params.projectID;
    try {
        const project = await Project.findById(projectID).populate('teamMembers', 'name email').populate('leader', 'name email');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.createProject = async (req, res) => {
    const userID = req.user.id;
    const { name, logo, description, status, activity, dueDate, teamMembers } = req.body;
    try {
        const project = await Project.create({ name, logo, description, status, activity, dueDate, leader: userID, teamMembers });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateProject = async (req, res) => {
    const projectID = req.params.projectID;
    const { name, logo, description, status, activity, dueDate, teamMembers } = req.body;
    try {
        const project = await Project.findByIdAndUpdate(projectID, { name, logo, description, status, activity, dueDate, teamMembers}, { new: true });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteProject = async (req, res) => {
    const projectID = req.params.projectID;
    try {
        await Project.findByIdAndDelete(projectID);
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.searchProject = async (req, res) => {
    const { name } = req.query;
    const userID = req.user.id;
    try {
        const projects = await Project.find({ 
            $or: [
                {leader: userID},
                {teamMembers: userID},
            ],
            name: { $regex: name, $options: 'i' }
        })
        .populate('teamMembers', 'name email')
        .populate('leader', 'name email')
        .populate('tasks')

        if (!projects) {
            return res.status(404).json({ message: 'No projects found' });
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}