const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect);

router.get('/my-tasks', taskController.getMyTasks);
router.get('/', taskController.getTasks);
router.post('/', adminOnly, taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', adminOnly, taskController.deleteTask);

module.exports = router; 