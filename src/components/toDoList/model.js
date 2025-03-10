import { Schema, model } from 'mongoose';

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Todo = model('Todo', todoSchema);

export default Todo;