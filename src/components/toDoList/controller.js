import Todo from './model.js';

const getTodos = async (req, res) => {
  try {
    const { isCompleted } = req.body;
    const { userId } = req.user;

    let filter = { user: userId }; // Ensure only current user's todos are fetched
    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted;
    }

    const todos = await Todo.find(filter);
    const completedCount = await Todo.countDocuments({ user: userId, isCompleted: true });

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
    const { userId } = req.user;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a title' });
    }
    const newTodo = new Todo({ title, isCompleted, user: userId });
    await newTodo.save();
    res.status(201).json({ success: true, data: newTodo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { title, isCompleted } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user: userId }, // Ensure user can only update their own todo
      { title, isCompleted },
      { new: true, runValidators: true }
    );

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
    const { userId } = req.user;

    const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: userId });

    if (!deletedTodo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export { getTodos, createTodo, updateTodo, deleteTodo };
