const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect);

router.get('/', projectController.getProjects);
router.post('/', adminOnly, projectController.createProject);
router.get('/:id', projectController.getProjectById);
router.put('/:id', adminOnly, projectController.updateProject);
router.delete('/:id', adminOnly, projectController.deleteProject);


module.exports = router;