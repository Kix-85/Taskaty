const User = require('../models/user.model');

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.send(error);
    }
}

module.exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.send(user);
    } catch (error) {
        res.send(error);
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.send(user);
    } catch (error) {
        res.send(error);
    }
}

module.exports.deleteUser = (req, res) => {
    try {
        const id = req.params.id;
        User.findByIdAndDelete(id);
        res.send("user deleted");
    } catch (error) {
        res.send(error);
    }
}

module.exports.searchUser = (req, res) => {
    try {
        const name = req.query.name;
        const age = req.query.age;
        const user = User.find({ name, age });
        res.send(user);
    } catch (error) {
        res.send(error);
    }
}