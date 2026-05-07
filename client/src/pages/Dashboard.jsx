import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Plus, Folder, Clock, CheckCircle, ListTodo, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, statsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks/stats')
      ]);
      setProjects(projectsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', newProject);
      setProjects([...projects, data]);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      toast.success('Project created successfully!');
      fetchData(); // Refresh stats too
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  if (loading) return <div className="text-center pt-20">Loading dashboard...</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-slate-400">Here's what's happening with your projects today.</p>
        </div>
        {user.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<ListTodo className="text-indigo-400" />} 
          label="Total Tasks" 
          value={stats?.totalTasks || 0} 
          color="indigo"
        />
        <StatCard 
          icon={<Clock className="text-amber-400" />} 
          label="Overdue" 
          value={stats?.overdueTasks || 0} 
          color="amber"
        />
        <StatCard 
          icon={<CheckCircle className="text-emerald-400" />} 
          label="Completed" 
          value={stats?.statusCounts?.['Done'] || 0} 
          color="emerald"
        />
        <StatCard 
          icon={<Users className="text-pink-400" />} 
          label="My Assigned" 
          value={stats?.myTasks || 0} 
          color="pink"
        />
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Folder className="text-indigo-500" />
          Active Projects
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-6 h-full hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-slate-400">
                      {project.members.length} members
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-500">
                    Admin: <span className="text-slate-300 font-medium">{project.admin.name}</span>
                  </span>
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((m, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px]">
                        {m.name.charAt(0)}
                      </div>
                    ))}
                    {project.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px]">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card">
              <Folder className="mx-auto text-slate-600 mb-4" size={48} />
              <p className="text-slate-400">No projects found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 w-full max-w-md relative"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Project Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Website Redesign"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  required
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Describe the project goals..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card p-6 flex items-center gap-6">
    <div className={`p-4 bg-${color}-500/10 rounded-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

export default Dashboard;
