let tasks = [
    {
        title: 'Study JS',
        deadLine: '2022-01-01',
        priority: 'high',
        status: 'pending',
        description: 'some description',
        contributers: ["John", "Ali", "Ahmed"]
    },
    {
        title: 'Study React',
        deadLine: '2022-01-01',
        priority: 'high',
        status: 'pending',
        description: 'some description',
        contributers: ["John", "Ali", "Ahmed"]
    }
];

exports.getAllTasks = (req, res) => {
    res.json(tasks);
};

exports.createTask = (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.status(201).json({ message: "Task created", task });
};

exports.updateTask = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTask = req.body;

    if (id >= 0 && id < tasks.length) {
        tasks[id] = updatedTask;
        res.json({ message: "Task updated", task: updatedTask });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
};

exports.deleteTask = (req, res) => {
    const id = parseInt(req.params.id);

    if (id >= 0 && id < tasks.length) {
        tasks.splice(id, 1);
        res.json({ message: "Task deleted", tasks });
    } else {
        res.status(404).json({ message: "Task not found" });
    }
};

exports.searchTask = (req, res) => {
    const { name, age } = req.query;
    res.send(`Hello ${name}, your age is ${age}`);
};
