const Task = require('../models/Task');
const Project = require('../models/Project');

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, project, assignedTo } = req.body;

        const projectExists = await Project.findById(project);
        if (!projectExists) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only admin can create tasks
        if (projectExists.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only project admin can create tasks' });
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            project,
            assignedTo,
            createdBy: req.user.id
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Tasks for Project
exports.getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project || !project.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const tasks = await Task.find({ project: projectId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Task Status
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);
        
        // Members can only update tasks assigned to them, Admin can update any
        const assignedToId = task.assignedTo ? task.assignedTo.toString() : null;
        if (assignedToId !== req.user.id && project.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const userProjects = await Project.find({ members: { $in: [req.user.id] } });
        const projectIds = userProjects.map(p => p._id);

        const tasks = await Task.find({ project: { $in: projectIds } });

        const stats = {
            totalTasks: tasks.length,
            statusCounts: {
                'To Do': tasks.filter(t => t.status === 'To Do').length,
                'In Progress': tasks.filter(t => t.status === 'In Progress').length,
                'Done': tasks.filter(t => t.status === 'Done').length
            },
            overdueTasks: tasks.filter(t => t.status !== 'Done' && new Date(t.dueDate) < new Date()).length,
            myTasks: tasks.filter(t => t.assignedTo && t.assignedTo.toString() === req.user.id).length
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
