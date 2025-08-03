import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  membership: {
    type: String,
    default: 'Free Member',
  },
  avatar: {
    type: String,
    default: '👤',
  },
  bio: {
    type: String,
    default: '',
  },
  preferences: {
    currency: {
      type: String,
      default: 'INR',
    },
    language: {
      type: String,
      default: 'English',
    },
    timezone: {
      type: String,
      default: 'IST',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  stats: {
    goalsCreated: {
      type: Number,
      default: 0,
    },
    goalsAchieved: {
      type: Number,
      default: 0,
    },
    totalSavings: {
      type: Number,
      default: 0,
    },
    daysActive: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User; 