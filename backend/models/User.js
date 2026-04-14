const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    program: { type: String, required: true },
    yearOfStudy: { type: Number, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    joinedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);