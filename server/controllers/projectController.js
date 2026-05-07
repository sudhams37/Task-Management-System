const Project = require('../models/Project');
const User = require('../models/User');

// Create Project
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const project = await Project.create({
            name,
            description,
            admin: req.user.id,
            members: [req.user.id]
        });

        const populatedProject = await Project.findById(project._id)
            .populate('admin', 'name email')
            .populate('members', 'name email');

        res.status(201).json(populatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Projects for User
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: { $in: [req.user.id] }
        }).populate('admin', 'name email').populate('members', 'name email');
        
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Member to Project
exports.addMember = async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is admin
        if (project.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add members' });
        }

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (project.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'User already a member' });
        }

        project.members.push(userToAdd._id);
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove Member from Project
exports.removeMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const memberId = req.params.memberId;
        if (memberId === project.admin.toString()) {
            return res.status(400).json({ message: 'Cannot remove admin' });
        }

        project.members = project.members.filter(m => m.toString() !== memberId);
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
