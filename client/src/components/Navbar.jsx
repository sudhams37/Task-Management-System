import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut, User, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-card mx-4 mt-4 px-6 py-4 flex items-center justify-between sticky top-4 z-50">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
        <CheckSquare className="text-indigo-500" size={32} />
        <span>TeamTask</span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
              <Layout size={20} />
              <span>Dashboard</span>
            </Link>
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <User size={18} />
                </div>
                <span className="font-medium">{user.name}</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
