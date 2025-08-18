const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['To Do', 'Ongoing', 'Completed'],
        default: 'To Do',
    },
    target_date: { type: Date },
    completed: Boolean, // Keeping for now, but status is preferred
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Task', taskSchema);
