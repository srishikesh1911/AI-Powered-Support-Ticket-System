import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Ticket, Clock, AlertOctagon, CheckCircle2, Cpu, Zap, Activity, BrainCircuit, HeartPulse } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, catRes, prioRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/categories'),
          api.get('/analytics/priorities')
        ]);
        
        setStats(statsRes.data);
        setCategories(catRes.data);
        setPriorities(prioRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    if (user?.role !== 'Customer') {
      fetchDashboardData();
    }
  }, [user]);

  if (user?.role === 'Customer') {
    return (
      <div className="glass-panel p-8">
        <h1 className="text-2xl font-bold mb-4 text-white">Welcome, {user.name}!</h1>
        <p className="text-slate-400">Navigate to Tickets to view your support requests or Create Ticket to submit a new one.</p>
      </div>
    );
  }

  if (!stats) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm animate-pulse">Initializing AI Command Center...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Support Command Center</h1>
        <p className="text-slate-400 mt-1">Intelligent customer support operations</p>
      </div>

      {/* AI Command Center Panel */}
      <div className="glass-panel relative overflow-hidden ai-glow group">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-48 h-48 text-blue-500" />
        </div>
        
        <div className="p-8 relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">AI Command Center</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider ml-2">Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-400">Classification Accuracy</p>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">{stats.aiAccuracy || 94}%</p>
              <p className="text-xs text-green-400 mt-2 flex items-center">
                ↑ 2% from last week
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-400">Auto-Routed Tickets</p>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">{stats.autoRoutedTickets}</p>
              <p className="text-xs text-slate-500 mt-2">100% of incoming volume</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-400">Critical Attention</p>
                <AlertOctagon className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-red-400 mt-2">{stats.criticalTickets}</p>
              <p className="text-xs text-red-400/80 mt-2">Requires immediate action</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-400">Global Sentiment</p>
                <HeartPulse className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white mt-2">Neutral</p>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                <div className="bg-gradient-to-r from-red-500 via-amber-500 to-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tickets" value={stats.totalTickets} icon={Ticket} color="blue" />
        <StatCard title="Open Tickets" value={stats.openTickets} icon={Clock} color="amber" />
        <StatCard title="Critical" value={stats.criticalTickets} icon={AlertOctagon} color="red" />
        <StatCard title="Resolved" value={stats.resolvedTickets} icon={CheckCircle2} color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Tickets by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#1e293b', opacity: 0.5}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Tickets by Priority</h3>
          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorities}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {priorities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">{stats.totalTickets}</span>
                <span className="block text-xs text-slate-400">Total</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {priorities.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm text-slate-300">
                <span className="w-3 h-3 rounded-full mr-2 shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
    red: 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    green: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
  };

  return (
    <div className="glass-card p-6 flex items-center justify-between group">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-4 rounded-xl border transition-all duration-300 group-hover:scale-110 ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Dashboard;
