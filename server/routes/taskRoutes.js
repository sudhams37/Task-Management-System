const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, getDashboardStats } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.post('/', protect, createTask);
router.get('/project/:projectId', protect, getTasks);
router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;
