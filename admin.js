const express = require('express');
const User = require('../models/User');
const Group = require('../models/Group');
const StudySession = require('../models/StudySession');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGroups = await Group.countDocuments();
    const totalSessions = await StudySession.countDocuments();
    
    // Most active courses (groups grouped by course)
    const activeCourses = await Group.aggregate([
      { $group: { _id: '$courseName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      totalGroups,
      totalSessions,
      activeCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all groups
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('leader', 'name email')
      .populate('members', 'name')
      .sort('-createdAt');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a group (admin)
router.delete('/groups/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user (admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;