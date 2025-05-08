import express from 'express';
import User from '../models/User.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('debates', 'title status scheduledFor')
      .populate('moderatedDebates', 'title status scheduledFor')
      .populate('participatedDebates', 'title status scheduledFor');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, profileImage, interests } = req.body;
    
    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;
    if (interests) updateData.interests = interests;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's upcoming debates
router.get('/upcoming-debates', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get debates where user is moderator or participant and status is upcoming
    const debatesAsModerator = await Debate.find({
      moderator: req.user.id,
      status: 'upcoming',
      scheduledFor: { $gte: new Date() }
    }).sort({ scheduledFor: 1 });
    
    const debatesAsParticipant = await Debate.find({
      'participants.user': req.user.id,
      status: 'upcoming',
      scheduledFor: { $gte: new Date() }
    }).sort({ scheduledFor: 1 });
    
    res.json({
      asModerator: debatesAsModerator,
      asParticipant: debatesAsParticipant
    });
  } catch (error) {
    console.error('Get upcoming debates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's debate history
router.get('/debate-history', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get past debates
    const debatesAsModerator = await Debate.find({
      moderator: req.user.id,
      status: 'completed'
    }).sort({ scheduledFor: -1 });
    
    const debatesAsParticipant = await Debate.find({
      'participants.user': req.user.id,
      status: 'completed'
    }).sort({ scheduledFor: -1 });
    
    res.json({
      asModerator: debatesAsModerator,
      asParticipant: debatesAsParticipant
    });
  } catch (error) {
    console.error('Get debate history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get personalized debate suggestions
router.get('/recommended-debates', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's interests
    const userInterests = user.interests || [];
    
    // Get user's participated debates to find categories and tags they're interested in
    const participatedDebates = await Debate.find({
      '_id': { $in: user.participatedDebates }
    });
    
    // Extract categories and tags from participated debates
    const participatedCategories = [...new Set(participatedDebates.map(d => d.category))];
    const participatedTags = [...new Set(participatedDebates.flatMap(d => d.tags))];
    
    // Find upcoming debates that match user's interests, categories, or tags
    let recommendedDebates = await Debate.find({
      $and: [
        { status: 'upcoming' },
        { scheduledFor: { $gte: new Date() } },
        {
          $or: [
            // Match based on user's explicit interests
            { tags: { $in: userInterests } },
            // Match based on categories from past debates
            { category: { $in: participatedCategories } },
            // Match based on tags from past debates
            { tags: { $in: participatedTags } }
          ]
        },
        // Exclude debates user is already participating in
        { 
          $and: [
            { moderator: { $ne: req.user.id } },
            { 'participants.user': { $ne: req.user.id } }
          ]
        }
      ]
    })
    .sort({ scheduledFor: 1 })
    .limit(10);
    
    // If we don't have enough recommended debates, add some general upcoming debates
    if (recommendedDebates.length < 5) {
      const generalDebates = await Debate.find({
        status: 'upcoming',
        scheduledFor: { $gte: new Date() },
        moderator: { $ne: req.user.id },
        'participants.user': { $ne: req.user.id }
      })
      .sort({ scheduledFor: 1 })
      .limit(5 - recommendedDebates.length);
      
      recommendedDebates = [...recommendedDebates, ...generalDebates];
    }
    
    res.json(recommendedDebates);
  } catch (error) {
    console.error('Get recommended debates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow a user
router.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    
    const userToFollow = await User.findById(req.params.userId);
    
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentUser = await User.findById(req.user.id);
    
    // Check if already following
    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    
    // Update current user's following
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.userId }
    });
    
    // Update followed user's followers
    await User.findByIdAndUpdate(req.params.userId, {
      $push: { followers: req.user.id }
    });
    
    res.json({ message: 'Now following user' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', authenticateToken, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentUser = await User.findById(req.user.id);
    
    // Check if actually following
    if (!currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Not following this user' });
    }
    
    // Update current user's following
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.userId }
    });
    
    // Update followed user's followers
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { followers: req.user.id }
    });
    
    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin only: Get all users
router.get('/', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin only: Update user role
router.put('/:userId/role', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Valid role required (user, moderator, admin)' });
    }
    
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update role
    user.role = role;
    await user.save();
    
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;