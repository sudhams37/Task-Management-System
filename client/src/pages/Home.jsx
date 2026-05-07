import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, BarChart3, ShieldCheck } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Users className="text-pink-500" size={32} />,
      title: "Team Collaboration",
      desc: "Create projects and invite your team members to work together in real-time."
    },
    {
      icon: <CheckCircle2 className="text-indigo-500" size={32} />,
      title: "Task Management",
      desc: "Organize tasks with priorities, due dates, and real-time status updates."
    },
    {
      icon: <BarChart3 className="text-blue-500" size={32} />,
      title: "Insightful Dashboard",
      desc: "Track progress with visual statistics and stay on top of overdue tasks."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" size={32} />,
      title: "Role-Based Access",
      desc: "Secure management with Admin and Member roles for controlled permissions."
    }
  ];

  return (
    <div className="flex flex-col items-center pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
          Manage Your Team Tasks with <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Precision & Elegance
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          A powerful, collaborative workspace for teams to streamline projects, 
          track progress, and achieve goals faster with our intuitive management tool.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="btn-primary text-lg px-8 py-4">
            Start for Free
          </Link>
          <Link to="/login" className="glass-card px-8 py-4 font-semibold hover:bg-white/5 transition-all">
            Live Demo
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 w-full max-w-7xl px-4">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 flex flex-col items-start gap-4 hover:border-indigo-500/50 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
