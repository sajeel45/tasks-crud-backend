const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

// Pre-save hook to sync isCompleted with status
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.isCompleted = this.status === 'completed';
  } else if (this.isModified('isCompleted')) {
    this.status = this.isCompleted ? 'completed' : 'pending';
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
