import mongoose from 'mongoose';

const debateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    position: {
      type: String,
      enum: ['for', 'against', 'neutral'],
      required: true
    },
    speaking: {
      type: Boolean,
      default: false
    }
  }],
  audience: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  scheduledFor: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  format: {
    type: String,
    enum: ['structured', 'open', 'moderated'],
    default: 'moderated'
  },
  votingEnabled: {
    type: Boolean,
    default: true
  },
  chatEnabled: {
    type: Boolean,
    default: true
  },
  reactionsEnabled: {
    type: Boolean,
    default: true
  },
  votes: {
    for: {
      type: Number,
      default: 0
    },
    against: {
      type: Number,
      default: 0
    },
    neutral: {
      type: Number,
      default: 0
    }
  },
  recording: {
    type: String,
    default: ''
  },
  winner: {
    type: String,
    enum: ['for', 'against', 'tie', ''],
    default: ''
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featuredImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for efficient querying
debateSchema.index({ title: 'text', description: 'text' });
debateSchema.index({ category: 1 });
debateSchema.index({ status: 1 });
debateSchema.index({ scheduledFor: 1 });
debateSchema.index({ tags: 1 });

const Debate = mongoose.model('Debate', debateSchema);

export default Debate;