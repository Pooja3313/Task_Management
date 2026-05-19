
// Get dashboard stats
const Project = require('../models/Project');
const Task = require('../models/Task');

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {

    let totalProjects = 0;
    let totalTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;

    let statusCounts = {
      todo: 0,
      'in-progress': 0,
      completed: 0
    };

    // ================= ADMIN =================
    if (req.user.role === 'admin') {

      // Admin sees everything
      totalProjects = await Project.countDocuments();

      totalTasks = await Task.countDocuments();

      completedTasks = await Task.countDocuments({
        status: 'completed'
      });

      const today = new Date();

      overdueTasks = await Task.countDocuments({
        dueDate: { $lt: today },
        status: { $ne: 'completed' }
      });

      const tasksByStatus = await Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      tasksByStatus.forEach(item => {
        statusCounts[item._id] = item.count;
      });

    } else {

      // ================= MEMBER =================

      // Sirf assigned tasks
      const memberTasks = await Task.find({
        assignedTo: req.user._id
      }).select('project status dueDate');

      totalTasks = memberTasks.length;

      // Unique project count
      const uniqueProjects = [
        ...new Set(memberTasks.map(task => task.project.toString()))
      ];

      totalProjects = uniqueProjects.length;

      // Completed tasks
      completedTasks = memberTasks.filter(
        task => task.status === 'completed'
      ).length;

      // Overdue tasks
      const today = new Date();

      overdueTasks = memberTasks.filter(task =>
        task.dueDate &&
        new Date(task.dueDate) < today &&
        task.status !== 'completed'
      ).length;

      // Status count
      memberTasks.forEach(task => {

        if (task.status === 'todo') {
          statusCounts.todo += 1;
        }

        if (task.status === 'in-progress') {
          statusCounts['in-progress'] += 1;
        }

        if (task.status === 'completed') {
          statusCounts.completed += 1;
        }

      });
    }

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

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });

  }
};