const express = require('express');
const { body, validationResult } = require('express-validator');
const Group = require('../models/Group');
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, [
  body('groupName').notEmpty().withMessage('Group name is required'),
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('courseCode').notEmpty().withMessage('Course code is required'),
  body('faculty').notEmpty().withMessage('Faculty is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('meetingLocation').notEmpty().withMessage('Meeting location is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const group = await Group.create({
      ...req.body,
      leader: req.user._id
    });

    // Add group to user's joined groups
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groupsJoined: group._id }
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all groups with filters
router.get('/', protect, async (req, res) => {
  try {
    const { courseName, faculty, search } = req.query;
    let filter = { isActive: true };

    if (courseName) filter.courseName = { $regex: courseName, $options: 'i' };
    if (faculty) filter.faculty = { $regex: faculty, $options: 'i' };
    if (search) {
      filter.$or = [
        { groupName: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } }
      ];
    }

    const groups = await Group.find(filter)
      .populate('leader', 'name email')
      .populate('members', 'name email')
      .sort('-createdAt');

    // Add member count to each group
    const groupsWithCount = groups.map(group => ({
      ...group.toObject(),
      memberCount: group.members.length + 1
    }));

    res.json(groupsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single group
router.get('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('leader', 'name email programOfStudy')
      .populate('members', 'name email programOfStudy yearOfStudy');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a group
router.post('/:id/join', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(req.user._id) || group.leader.equals(req.user._id)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    group.members.push(req.user._id);
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { groupsJoined: group._id }
    });

    res.json({ message: 'Successfully joined the group', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leave a group
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.leader.equals(req.user._id)) {
      return res.status(400).json({ message: 'Group leader cannot leave. Transfer leadership first or delete the group.' });
    }

    group.members = group.members.filter(m => !m.equals(req.user._id));
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { groupsJoined: group._id }
    });

    res.json({ message: 'Successfully left the group' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update group (leader only)
router.put('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.leader.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only group leader can edit group information' });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get group posts
router.get('/:id/posts', protect, async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.id })
      .populate('author', 'name email')
      .populate('comments.author', 'name')
      .sort('-createdAt');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post in group
router.post('/:id/posts', protect, [
  body('content').notEmpty().withMessage('Post content is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const post = await Post.create({
      group: req.params.id,
      author: req.user._id,
      content: req.body.content,
      type: req.body.type || 'general'
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;