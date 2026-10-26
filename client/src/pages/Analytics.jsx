import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Analytics = () => {
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock trend data
  const trendData = [
    { name: 'Mon', tickets: 12, resolved: 8 },
    { name: 'Tue', tickets: 19, resolved: 15 },
    { name: 'Wed', tickets: 15, resolved: 12 },
    { name: 'Thu', tickets: 22, resolved: 18 },
    { name: 'Fri', tickets: 10, resolved: 11 },
    { name: 'Sat', tickets: 5, resolved: 4 },
    { name: 'Sun', tickets: 7, resolved: 6 },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [catRes, prioRes] = await Promise.all([
          api.get('/analytics/categories'),
          api.get('/analytics/priorities')
        ]);
        
        setCategories(catRes.data);
        setPriorities(prioRes.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400">Loading analytics...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Deep insights into support operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ticket Volume Trends */}
        <div className="glass-panel p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Ticket Volume Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tick={{fill: '#64748b'}} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="tickets" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTickets)" name="Incoming Tickets" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" name="Resolved Tickets" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Distribution by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" tick={{fill: '#64748b'}} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{fill: '#64748b', fontSize: 12}} width={120} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#1e293b', opacity: 0.5}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priorities */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Distribution by Priority</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorities}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
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
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
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

export default Analytics;
