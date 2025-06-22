const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;