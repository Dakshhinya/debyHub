import express from 'express';
import Debate from '../models/Debate.js';
import User from '../models/User.js';
import { authenticateToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all debates with filtering options
router.get('/', async (req, res) => {
  try {
    const { status, category, tag, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get debates
    const debates = await Debate.find(filter)
      .populate('moderator', 'name profileImage')
      .sort({ scheduledFor: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const total = await Debate.countDocuments(filter);
    
    res.json({
      debates,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get debates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single debate by ID
router.get('/:id', async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id)
      .populate('moderator', 'name email profileImage bio')
      .populate('participants.user', 'name profileImage bio')
      .populate('audience', 'name profileImage')
      .lean();
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    res.json(debate);
  } catch (error) {
    console.error('Get debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new debate (moderator or admin only)
router.post('/', authenticateToken, checkRole(['moderator', 'admin']), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      scheduledFor,
      duration,
      format,
      visibility,
      votingEnabled,
      chatEnabled,
      reactionsEnabled,
      featuredImage
    } = req.body;
    
    const newDebate = new Debate({
      title,
      description,
      moderator: req.user.id,
      category,
      tags: tags || [],
      scheduledFor,
      duration: duration || 60,
      format: format || 'moderated',
      visibility: visibility || 'public',
      votingEnabled: votingEnabled !== undefined ? votingEnabled : true,
      chatEnabled: chatEnabled !== undefined ? chatEnabled : true,
      reactionsEnabled: reactionsEnabled !== undefined ? reactionsEnabled : true,
      featuredImage
    });
    
    const savedDebate = await newDebate.save();
    
    // Add debate to moderator's list
    await User.findByIdAndUpdate(req.user.id, {
      $push: { moderatedDebates: savedDebate._id }
    });
    
    res.status(201).json(savedDebate);
  } catch (error) {
    console.error('Create debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update debate (moderator or admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is moderator of this debate or an admin
    if (debate.moderator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this debate' });
    }
    
    const updatedDebate = await Debate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedDebate);
  } catch (error) {
    console.error('Update debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete debate (moderator or admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is moderator of this debate or an admin
    if (debate.moderator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this debate' });
    }
    
    await Debate.findByIdAndDelete(req.params.id);
    
    // Remove from moderator's list
    await User.findByIdAndUpdate(debate.moderator, {
      $pull: { moderatedDebates: req.params.id }
    });
    
    // Remove from participants' lists
    for (const participant of debate.participants) {
      await User.findByIdAndUpdate(participant.user, {
        $pull: { participatedDebates: req.params.id }
      });
    }
    
    res.json({ message: 'Debate deleted successfully' });
  } catch (error) {
    console.error('Delete debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join debate as participant
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const { position } = req.body;
    
    if (!position || !['for', 'against', 'neutral'].includes(position)) {
      return res.status(400).json({ message: 'Valid position required (for, against, neutral)' });
    }
    
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is already a participant
    const isParticipant = debate.participants.some(p => p.user.toString() === req.user.id);
    
    if (isParticipant) {
      return res.status(400).json({ message: 'Already a participant in this debate' });
    }
    
    // Add user as participant
    debate.participants.push({
      user: req.user.id,
      position,
      speaking: false
    });
    
    await debate.save();
    
    // Add debate to user's participated list
    await User.findByIdAndUpdate(req.user.id, {
      $push: { participatedDebates: req.params.id }
    });
    
    res.json({ message: 'Joined debate successfully' });
  } catch (error) {
    console.error('Join debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join debate as audience
router.post('/:id/audience', authenticateToken, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is already in the audience
    const isInAudience = debate.audience.some(a => a.toString() === req.user.id);
    
    // Check if user is a participant
    const isParticipant = debate.participants.some(p => p.user.toString() === req.user.id);
    
    // Check if user is the moderator
    const isModerator = debate.moderator.toString() === req.user.id;
    
    if (isInAudience) {
      return res.status(400).json({ message: 'Already in the audience for this debate' });
    }
    
    if (isParticipant || isModerator) {
      return res.status(400).json({ message: 'Already a participant or moderator in this debate' });
    }
    
    // Add user to audience
    debate.audience.push(req.user.id);
    await debate.save();
    
    res.json({ message: 'Joined audience successfully' });
  } catch (error) {
    console.error('Join audience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave debate (as participant or audience)
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is a participant
    const participantIndex = debate.participants.findIndex(p => p.user.toString() === req.user.id);
    
    if (participantIndex !== -1) {
      // Remove participant
      debate.participants.splice(participantIndex, 1);
      
      // Remove from user's participated list
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { participatedDebates: req.params.id }
      });
    } else {
      // Check if user is in audience
      const audienceIndex = debate.audience.findIndex(a => a.toString() === req.user.id);
      
      if (audienceIndex !== -1) {
        // Remove from audience
        debate.audience.splice(audienceIndex, 1);
      } else {
        return res.status(400).json({ message: 'Not a participant or audience member in this debate' });
      }
    }
    
    await debate.save();
    
    res.json({ message: 'Left debate successfully' });
  } catch (error) {
    console.error('Leave debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Moderator control: Start debate
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is the moderator or an admin
    if (debate.moderator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to start this debate' });
    }
    
    // Update debate status
    debate.status = 'live';
    await debate.save();
    
    res.json({ message: 'Debate started successfully' });
  } catch (error) {
    console.error('Start debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Moderator control: End debate
router.post('/:id/end', authenticateToken, async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is the moderator or an admin
    if (debate.moderator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to end this debate' });
    }
    
    // Update debate status
    debate.status = 'completed';
    
    // Determine winner if voting is enabled
    if (debate.votingEnabled) {
      const { for: forVotes, against: againstVotes } = debate.votes;
      
      if (forVotes > againstVotes) {
        debate.winner = 'for';
      } else if (againstVotes > forVotes) {
        debate.winner = 'against';
      } else {
        debate.winner = 'tie';
      }
    }
    
    await debate.save();
    
    res.json({ message: 'Debate ended successfully', winner: debate.winner });
  } catch (error) {
    console.error('End debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Moderator control: Toggle participant speaking status
router.post('/:id/toggle-speaking', authenticateToken, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ message: 'Participant ID required' });
    }
    
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Check if user is the moderator or an admin
    if (debate.moderator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to control speaking rights' });
    }
    
    // Find participant
    const participantIndex = debate.participants.findIndex(p => p.user.toString() === participantId);
    
    if (participantIndex === -1) {
      return res.status(404).json({ message: 'Participant not found in this debate' });
    }
    
    // Toggle speaking status
    debate.participants[participantIndex].speaking = !debate.participants[participantIndex].speaking;
    
    await debate.save();
    
    res.json({ 
      message: `Participant speaking status updated`,
      speaking: debate.participants[participantIndex].speaking
    });
  } catch (error) {
    console.error('Toggle speaking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on debate
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { position } = req.body;
    
    if (!position || !['for', 'against', 'neutral'].includes(position)) {
      return res.status(400).json({ message: 'Valid position required (for, against, neutral)' });
    }
    
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    if (!debate.votingEnabled) {
      return res.status(400).json({ message: 'Voting is disabled for this debate' });
    }
    
    // Increment vote count
    debate.votes[position] += 1;
    
    await debate.save();
    
    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add feedback
router.post('/:id/feedback', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating required (1-5)' });
    }
    
    const debate = await Debate.findById(req.params.id);
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    // Add feedback
    debate.feedback.push({
      user: req.user.id,
      rating,
      comment,
      createdAt: new Date()
    });
    
    await debate.save();
    
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get debate categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Debate.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get debate tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await Debate.distinct('tags');
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;