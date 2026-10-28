import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Ticket, FilePlus, BarChart3, Users, LogOut, 
  Zap, CheckCircle2, Layers, ShieldCheck
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (user?.role === 'Admin') {
      return [
        { name: 'Overall Scheme', path: '/', icon: Layers },
        { name: 'System Tickets', path: '/tickets', icon: Ticket },
        { name: 'Deep Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Teams & Routing', path: '/teams', icon: Users },
      ];
    }
    if (user?.role === 'Support Agent') {
      return [
        { name: 'Solution Workspace', path: '/', icon: CheckCircle2 },
        { name: 'Ticket Queue', path: '/tickets', icon: Ticket },
        { name: 'Team Directory', path: '/teams', icon: Users },
      ];
    }
    // Customer
    return [
      { name: 'Support Overview', path: '/', icon: LayoutDashboard },
      { name: 'My Tickets', path: '/tickets', icon: Ticket },
      { name: 'Create Ticket', path: '/create-ticket', icon: FilePlus },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col w-64 bg-slate-900/80 backdrop-blur-2xl border-r border-slate-700/50 text-slate-300 min-h-screen relative overflow-hidden z-20">
      
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

      <div className="flex flex-col h-20 px-6 justify-center border-b border-slate-800/50 relative z-10">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
          <Zap className="w-5 h-5 text-blue-400 mr-2" />
          AI Support
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-blue-400/80 mt-1">
          {user?.role === 'Admin' ? 'Executive Scheme Hub' : user?.role === 'Support Agent' ? 'Agent Resolution Hub' : 'Intelligent Support Center'}
        </p>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto relative z-10">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'hover:bg-slate-800/50 hover:text-slate-100 border border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110 duration-300" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-4 py-4 border-t border-slate-800/50 relative z-10 bg-slate-900/50">
        
        {/* System Online Indicator */}
        <div className="flex items-center px-4 py-3 mb-4 rounded-lg bg-slate-800/40 border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse mr-3"></div>
          <span className="text-xs font-medium text-slate-300">
            {user?.role === 'Admin' ? 'Scheme Monitor Active' : user?.role === 'Support Agent' ? 'Ready to Clear Solutions' : 'AI Support Online'}
          </span>
        </div>

        <div className="flex flex-col px-4 py-2 mb-2">
          <span className="text-sm font-semibold text-white">{user?.name}</span>
          <span className="text-xs text-blue-400/80 mt-0.5">
            {user?.role === 'Admin' ? 'System Administrator' : user?.role === 'Support Agent' ? 'Support Agent' : 'Customer'}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800/80 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;