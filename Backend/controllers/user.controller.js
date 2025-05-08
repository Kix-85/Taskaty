const User = require('../models/user.model');

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