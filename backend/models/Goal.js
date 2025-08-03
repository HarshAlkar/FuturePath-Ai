import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Short-Term', 'Long-Term'], required: true },
  progress: { type: Number, default: 0 },
  timeline: { type: String, required: true },
  icon: { type: String, default: '' },
  color: { type: String, default: '' },
  progressColor: { type: String, default: '' },
  recommendation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

goalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Goal', goalSchema); 