const express = require('express');
const router = express.Router(); // ✅ This line was missing
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET all users (admin only)
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
    const users = await User.find().select('-password')
    res.json(users)
})

// ✅ POST /api/users - Add new user (admin only)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already exists' });

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a user (admin only)
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (['admin@demo.com', 'user@demo.com'].includes(user.email)) {
            return res.status(403).json({ error: 'This user cannot be deleted.' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
