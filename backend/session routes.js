const express = require('express');
const { body, validationResult } = require('express-validator');
const StudySession = require('../models/StudySession');
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create study session (group leader only)
router.post('/', protect, [
  body('group').notEmpty().withMessage('Group ID is required'),
  body('title').notEmpty().withMessage('Session title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const group = await Group.findById(req.body.group);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is group leader or admin
    if (!group.leader.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only group leader can create study sessions' });
    }

    const session = await StudySession.create({
      ...req.body,
      createdBy: req.user._id
    });

    const populatedSession = await StudySession.findById(session._id)
      .populate('group', 'groupName courseCode')
      .populate('createdBy', 'name');

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sessions for a group
router.get('/group/:groupId', protect, async (req, res) => {
  try {
    const sessions = await StudySession.find({ group: req.params.groupId })
      .populate('group', 'groupName')
      .populate('createdBy', 'name')
      .sort({ date: 1, time: 1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming sessions for current user's groups
router.get('/upcoming', protect, async (req, res) => {
  try {
    const user = await req.user.populate('groupsJoined');
    const userGroups = [...user.groupsJoined.map(g => g._id), ...user.groupsJoined];
    
    const upcomingSessions = await StudySession.find({
      group: { $in: userGroups },
      date: { $gte: new Date() }
    })
      .populate('group', 'groupName courseCode')
      .populate('createdBy', 'name')
      .sort({ date: 1, time: 1 })
      .limit(10);
    
    res.json(upcomingSessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;