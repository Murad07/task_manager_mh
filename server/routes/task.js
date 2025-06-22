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

module.exports = router;