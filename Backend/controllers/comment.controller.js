const Task = require("../models/task.model");

module.exports.createComment = async (req, res) => {
    const taskID = req.params.taskID;
    const userID = req.user.id;
    const { comment } = req.body;
    try {
        const task = await Task.findById(taskID);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.comments.push({ user: userID, text: comment });
        await task.save();

        res.status(201).json({ message: 'Comment added successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.deleteComment = async (req, res) => {
    const taskID = req.params.taskID;
    const userID = req.user.id;
    const commentContent = req.body.content;  // send the content of the comment from frontend to be deleted

    try {
        const task = await Task.findById(taskID);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const commentIndex = task.comments.findIndex(comment => 
            comment.content === commentContent && comment.user.toString() === userID
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to delete it' });
        }

        task.comments.splice(commentIndex, 1);

        await task.save();

        res.status(200).json({ message: 'Comment deleted successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}