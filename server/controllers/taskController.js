const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// Get all tasks for a project
exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    if (!project) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // ? Sirf admin ya creator
    if (req.user.role !== 'admin' && 
        projectDoc.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const tasks = await Task.find({ project })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { tasks } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'title');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const projectDoc = await Project.findById(task.project._id);

    // ? Sirf admin ya creator
    if (req.user.role !== 'admin' && 
        projectDoc.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { task } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, project, dueDate } = req.body;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // ? Sirf role: 'member' wala user assign ho sakta hai
    if (assignedTo) {
      const userExists = await User.findOne({ _id: assignedTo, role: 'member' });
      if (!userExists) {
        return res.status(400).json({ success: false, message: 'Only members can be assigned to tasks' });
      }
    }

    const task = await Task.create({
      title, description,
      status: status || 'todo',
      priority: priority || 'medium',
      assignedTo, project, dueDate,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: { task: populatedTask }, message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const isAdmin = req.user.role === 'admin';

    const isAssignedMember =
      task.assignedTo?.toString() === req.user._id.toString();

    // ? Sirf admin ya assigned member update kar sakta hai
    if (!isAdmin && !isAssignedMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // ? Member sirf status change kar sakta hai
    if (!isAdmin && isAssignedMember) {
      const allowedFields = ['status'];

      const requestedFields = Object.keys(req.body);

      const hasInvalidField = requestedFields.some(
        field => !allowedFields.includes(field)
      );

      if (hasInvalidField) {
        return res.status(403).json({
          success: false,
          message: 'Members can only update task status'
        });
      }
    }

    // ? assignedTo me sirf member hi assign ho
    if (req.body.assignedTo) {
      const userExists = await User.findOne({
        _id: req.body.assignedTo,
        role: 'member'
      });

      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: 'Only members can be assigned to tasks'
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: { task: updatedTask },
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get my tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { tasks } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};