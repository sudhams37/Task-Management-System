import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Plus, UserPlus, UserMinus, Users, CheckCircle2, Circle, Clock, Trash2, Calendar, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  // Forms
  const [newTask, setNewTask] = useState({
    title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: ''
  });
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects`),
        api.get(`/tasks/project/${id}`)
      ]);
      const currentProj = projRes.data.find(p => p._id === id);
      if (!currentProj) {
        toast.error('Project not found');
        navigate('/dashboard');
        return;
      }
      setProject(currentProj);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/tasks', { ...newTask, project: id });
      setTasks([...tasks, data]);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      toast.success('Task created successfully!');
      fetchProjectData(); // Refresh to get populated data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${memberId}`);
      toast.success('Member removed successfully!');
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      toast.success('Member added successfully!');
      setMemberEmail('');
      setShowMemberModal(false);
      fetchProjectData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (loading) return <div className="text-center pt-20">Loading project...</div>;
  if (!project) return <div className="text-center pt-20 text-red-400">Project not found or failed to load.</div>;

  const isAdmin = project.admin?._id === user?._id || project.admin === user?._id;

  return (
    <div className="space-y-8 pb-20">
      {/* Project Header */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-4xl font-bold text-white">{project.name}</h1>
            <p className="text-slate-400 leading-relaxed">{project.description}</p>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <button 
                onClick={() => setShowMemberModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
              >
                <UserPlus size={18} />
                <span>Add Member</span>
              </button>
            )}
            {isAdmin && (
              <button 
                onClick={() => setShowTaskModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                <span>New Task</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock size={16} />
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 size={16} />
            <span>{tasks.filter(t => t.status === 'Done').length}/{tasks.length} Tasks Done</span>
          </div>
          <div className="flex -space-x-2">
            {project.members.map((m, i) => (
              <div 
                key={i} 
                title={m?.name || 'Unknown'}
                className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold"
              >
                {m?.name?.charAt(0) || '?'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users size={20} className="text-indigo-500" />
          Team Members ({project.members.length})
        </h3>
        <div className="flex flex-wrap gap-4">
          {project.members.filter(m => m && typeof m === 'object').map((member) => (
            <div 
              key={member._id} 
              className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl min-w-[200px] group relative"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                {member.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{member.name || 'Unknown User'}</p>
                <p className="text-xs text-slate-500">{member.email || 'No email'}</p>
              </div>
              {isAdmin && member._id !== (project.admin?._id || project.admin) && (
                <button 
                  onClick={() => handleRemoveMember(member._id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Member"
                >
                  <UserMinus size={16} />
                </button>
              )}
              {member._id === (project.admin?._id || project.admin) && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded uppercase font-bold">
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'To Do' ? 'bg-slate-400' : 
                  status === 'In Progress' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                {status}
              </h3>
              <span className="text-xs bg-white/5 px-2 py-1 rounded text-slate-500">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>

            <div className="space-y-4 min-h-[500px]">
              <AnimatePresence>
                {tasks.filter(t => t.status === status).map((task) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card p-5 hover:border-indigo-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {task.priority}
                      </span>
                      {(isAdmin || task.assignedTo?._id === user?._id) && (
                        <div className="flex gap-2">
                          {status !== 'To Do' && (
                            <button 
                              onClick={() => updateTaskStatus(task._id, status === 'Done' ? 'In Progress' : 'To Do')}
                              className="text-slate-500 hover:text-slate-300"
                            >
                              <Circle size={14} />
                            </button>
                          )}
                          {status !== 'Done' && (
                            <button 
                              onClick={() => updateTaskStatus(task._id, status === 'To Do' ? 'In Progress' : 'Done')}
                              className="text-slate-500 hover:text-emerald-400"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold mb-2 group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{task.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Calendar size={12} />
                        <span className={new Date(task.dueDate) < new Date() && status !== 'Done' ? 'text-red-400' : ''}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {task.assignedTo && typeof task.assignedTo === 'object' && (
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold" title={`Assigned to ${task.assignedTo.name || 'Unknown'}`}>
                          {task.assignedTo.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input 
                type="text" required className="input-field" placeholder="Task Title"
                value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea 
                required className="input-field h-24 resize-none" placeholder="Description"
                value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              ></textarea>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
                  <input 
                    type="date" required className="input-field"
                    value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                  <select 
                    className="input-field bg-slate-800"
                    value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Assign To</label>
                <select 
                  className="input-field bg-slate-800"
                  value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="">Select Member</option>
                  {project.members.filter(m => m && typeof m === 'object').map(m => (
                    <option key={m._id} value={m._id}>{m.name || 'Unknown User'}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-white/5">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Create Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Add Member</h2>
            <p className="text-slate-400 mb-6 text-sm">Invite someone to join this project by their email.</p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <input 
                type="email" required className="input-field" placeholder="member@company.com"
                value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}
              />
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowMemberModal(false)} className="flex-1 px-4 py-2 rounded-lg bg-white/5">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Add Member</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
