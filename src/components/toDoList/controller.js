import Todo from './model.js';

const getTodos = async (req, res) => {
  try {
    const { isCompleted } = req.body;
    
    let filter = {};
    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted;
    }

    const todos = await Todo.find(filter);
    const completedCount = await Todo.countDocuments({ isCompleted: true });

    res.status(200).json({
      success: true,
      data: todos,
      count: todos.length,
      completedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, isCompleted } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a title' });
    }
    const newTodo = new Todo({ title, isCompleted });
    await newTodo.save();
    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isCompleted } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(id, { title, isCompleted }, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, data: updatedTodo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export { getTodos, createTodo, updateTodo, deleteTodo };
