import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import debateRoutes from './routes/debates.js';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/video.js';

// Middleware
import { authenticateToken } from './middleware/auth.js';

// Configuration
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/debates', debateRoutes);
// app.use('/api/users', authenticateToken, userRoutes);
// app.use('/api/video', authenticateToken, videoRoutes);

// Socket.IO
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);
  
//   // Join debate room
//   socket.on('join-debate', ({ debateId, user }) => {
//     socket.join(`debate-${debateId}`);
//     socket.to(`debate-${debateId}`).emit('user-joined', user);
//     console.log(`${user.name} joined debate ${debateId}`);
//   });
  
//   // Leave debate room
//   socket.on('leave-debate', ({ debateId, user }) => {
//     socket.leave(`debate-${debateId}`);
//     socket.to(`debate-${debateId}`).emit('user-left', user);
//     console.log(`${user.name} left debate ${debateId}`);
//   });
  
//   // Chat message
//   socket.on('send-message', ({ debateId, message }) => {
//     io.to(`debate-${debateId}`).emit('new-message', message);
//   });
  
//   // Vote
//   socket.on('cast-vote', ({ debateId, vote }) => {
//     socket.to(`debate-${debateId}`).emit('new-vote', vote);
//   });
  
//   // Reaction
//   socket.on('send-reaction', ({ debateId, reaction }) => {
//     socket.to(`debate-${debateId}`).emit('new-reaction', reaction);
//   });
  
//   // Moderator actions
//   socket.on('moderator-action', ({ debateId, action }) => {
//     socket.to(`debate-${debateId}`).emit('moderator-action', action);
//   });
  
//   // Disconnect
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Serve frontend in production
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;