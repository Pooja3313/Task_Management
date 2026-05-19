const Project = require('../models/Project');
const Task = require('../models/Task');

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    let projectFilter;
    let taskFilter;

    if (req.user.role === 'admin') {
      // Admin sees all projects and tasks
      projectFilter = {};
      taskFilter = {};
    } else {
      // Member sees only their projects and tasks
      const userProjects = await Project.find({
        $or: [
          { createdBy: req.user._id },
          { 'members.user': req.user._id }
        ]
      }).select('_id');

      const projectIds = userProjects.map(p => p._id);
      projectFilter = { _id: { $in: projectIds } };
      taskFilter = { project: { $in: projectIds } };
    }

    // Total projects
    const totalProjects = await Project.countDocuments(projectFilter);

    // Total tasks
    const totalTasks = await Task.countDocuments(taskFilter);

    // Completed tasks
    const completedTasks = await Task.countDocuments({
      ...taskFilter,
      status: 'completed'
    });

    // Overdue tasks (dueDate < today and status != completed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      dueDate: { $lt: today },
      status: { $ne: 'completed' }
    });

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $match: taskFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format tasks by status
    const statusCounts = {
      todo: 0,
      'in-progress': 0,
      completed: 0
    };

    tasksByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        tasksByStatus: statusCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
