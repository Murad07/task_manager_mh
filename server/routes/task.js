const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Task = require('../models/Task');

// CRUD Endpoints for Task
router.get('/', verifyToken, async (req, res) => {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
});

router.post('/', verifyToken, async (req, res) => {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
});

// PUT /api/tasks/:id - update a task
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description } = req.body
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id })
        if (!task) return res.status(404).json({ error: 'Task not found' })

        task.title = title || task.title
        task.description = description || task.description
        await task.save()

        res.json(task)
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' })
    }
})

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
        if (!task) return res.status(404).json({ error: 'Task not found' })

        res.json({ message: 'Task deleted' })
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' })
    }
})


module.exports = router;