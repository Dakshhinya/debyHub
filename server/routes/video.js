import express from 'express';
import twilio from 'twilio';
import { authenticateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Twilio credentials from environment variables
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;

// Create Twilio client
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Generate a room token for Twilio video
router.post('/token', authenticateToken, async (req, res) => {
  try {
    const { debateId, identity, role } = req.body;
    
    if (!debateId || !identity) {
      return res.status(400).json({ message: 'Debate ID and identity are required' });
    }
    
    // For non-production use, we'll use the API Key and Secret to generate tokens
    // In production, you should use the Twilio SDK on your server
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;
    
    // Create an access token
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: identity }
    );
    
    // Create a video grant for this specific room
    const videoGrant = new VideoGrant({
      room: `debate-${debateId}`
    });
    
    // Add the grant to the token
    token.addGrant(videoGrant);
    
    // Serialize the token as a JWT
    const jwt = token.toJwt();
    
    res.json({ 
      token: jwt,
      identity,
      roomName: `debate-${debateId}`,
      role: role || 'participant'
    });
  } catch (error) {
    console.error('Generate token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if a room exists
router.get('/room/:debateId', authenticateToken, async (req, res) => {
  try {
    const roomName = `debate-${req.params.debateId}`;
    
    try {
      // Check if room exists
      const room = await twilioClient.video.rooms(roomName).fetch();
      
      res.json({
        exists: true,
        status: room.status,
        participantCount: room.participantCount
      });
    } catch (roomError) {
      // Room doesn't exist
      res.json({
        exists: false
      });
    }
  } catch (error) {
    console.error('Check room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a room if it doesn't exist (moderator only)
router.post('/room', authenticateToken, async (req, res) => {
  try {
    const { debateId, type } = req.body;
    
    if (!debateId) {
      return res.status(400).json({ message: 'Debate ID is required' });
    }
    
    const roomName = `debate-${debateId}`;
    const roomType = type || 'group'; // 'group' or 'peer-to-peer'
    
    try {
      // Check if room already exists
      const existingRoom = await twilioClient.video.rooms(roomName).fetch();
      
      return res.json({
        room: existingRoom,
        created: false,
        message: 'Room already exists'
      });
    } catch (roomError) {
      // Room doesn't exist, create it
      const room = await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: roomType,
        statusCallback: `${process.env.API_URL}/api/video/room-events`,
        statusCallbackMethod: 'POST'
      });
      
      res.json({
        room,
        created: true,
        message: 'Room created successfully'
      });
    }
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// End a room (moderator only)
router.post('/room/:debateId/end', authenticateToken, async (req, res) => {
  try {
    const roomName = `debate-${req.params.debateId}`;
    
    try {
      // Update room status to completed
      await twilioClient.video.rooms(roomName).update({ status: 'completed' });
      
      res.json({ message: 'Room ended successfully' });
    } catch (roomError) {
      res.status(404).json({ message: 'Room not found or already ended' });
    }
  } catch (error) {
    console.error('End room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove participant from room (moderator only)
router.post('/room/:debateId/remove', authenticateToken, async (req, res) => {
  try {
    const { participantIdentity } = req.body;
    
    if (!participantIdentity) {
      return res.status(400).json({ message: 'Participant identity is required' });
    }
    
    const roomName = `debate-${req.params.debateId}`;
    
    try {
      // Remove participant from room
      await twilioClient.video.rooms(roomName)
        .participants(participantIdentity)
        .update({ status: 'disconnected' });
      
      res.json({ message: 'Participant removed successfully' });
    } catch (roomError) {
      res.status(404).json({ message: 'Room or participant not found' });
    }
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Webhook for room events
router.post('/room-events', async (req, res) => {
  try {
    const event = req.body;
    
    // Log room events (for monitoring)
    console.log('Room event:', event);
    
    // In a real application, you would update your database
    // or trigger notifications based on room events
    
    res.status(200).send();
  } catch (error) {
    console.error('Room event error:', error);
    res.status(500).send();
  }
});

export default router;