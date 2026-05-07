const express = require('express');
const router = express.Router();
const { createProject, getProjects, addMember, removeMember } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createProject)
    .get(protect, getProjects);

router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:memberId', protect, removeMember);

module.exports = router;
