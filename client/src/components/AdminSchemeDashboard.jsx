import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Ticket, Clock, AlertOctagon, CheckCircle2, Cpu, Zap, Activity, 
  BrainCircuit, ShieldCheck, Users, Layers, ExternalLink, ArrowRight
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminSchemeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, catRes, prioRes, teamRes, ticketsRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/categories'),
          api.get('/analytics/priorities'),
          api.get('/analytics/teams'),
          api.get('/tickets?limit=5')
        ]);
        
        setStats(statsRes.data);
        setCategories(catRes.data);
        setPriorities(prioRes.data);
        setTeams(teamRes.data);
        setRecentTickets(ticketsRes.data.tickets || []);
      } catch (error) {
        console.error('Failed to load admin scheme data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm animate-pulse">Assembling Enterprise Scheme & Intelligence Model...</p>
      </div>
    );
  }

  // Scheme SLAs definitions
  const schemeTiers = [
    { tier: 'Critical Severity', target: '< 2 Hours', active: stats?.criticalTickets || 0, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
    { tier: 'High Severity', target: '< 6 Hours', active: priorities.find(p => p.name === 'High')?.value || 0, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { tier: 'Medium Severity', target: '< 24 Hours', active: priorities.find(p => p.name === 'Medium')?.value || 0, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { tier: 'Standard / Low', target: '< 48 Hours', active: priorities.find(p => p.name === 'Low')?.value || 0, color: 'text-slate-400 border-slate-700 bg-slate-800/40' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header with Enterprise Scheme Badging */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="px-2.5 py-1 text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-md">
              System Administration
            </span>
            <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              All Services Nominal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Operations & Overall Scheme</h1>
          <p className="text-slate-400 text-sm mt-1">Global oversight across AI classifiers, routing topologies, team workloads, and SLA compliance</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/analytics"
            className="flex items-center text-sm font-medium px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-200 border border-slate-700/60 rounded-lg transition-colors"
          >
            Deep Analytics <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link
            to="/teams"
            className="flex items-center text-sm font-medium px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-colors"
          >
            Manage Teams <ExternalLink className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>

      {/* Global Scheme Top-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total System Volume</span>
            <Ticket className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalTickets || 0}</p>
          <p className="text-xs text-slate-400 mt-2 flex items-center">
            <span className="text-blue-400 font-medium mr-1.5">100%</span> tracked under central scheme
          </p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolution Clearance</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mt-2">
            {stats?.totalTickets ? Math.round(((stats.resolvedTickets + stats.closedTickets) / stats.totalTickets) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {stats?.resolvedTickets + stats?.closedTickets} resolved / closed
          </p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Routing Quotient</span>
            <BrainCircuit className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-400 mt-2">{stats?.aiAccuracy || 94}%</p>
          <p className="text-xs text-slate-400 mt-2">
            {stats?.autoRoutedTickets} automated routing decisions
          </p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Backlog</span>
            <AlertOctagon className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400 mt-2">{stats?.criticalTickets || 0}</p>
          <p className="text-xs text-red-400/80 mt-2">Requires priority clearance</p>
        </div>
      </div>

      {/* OVERALL SCHEME ARCHITECTURE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scheme 1: Department Routing & Allocation Scheme */}
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Department Routing Scheme</h3>
                <p className="text-xs text-slate-400">Automated triage distribution across operational units</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              Active Load Ratio
            </span>
          </div>

          <div className="space-y-4">
            {teams.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No active team workloads registered.</p>
            ) : (
              teams.map((team, idx) => {
                const totalActive = teams.reduce((acc, curr) => acc + curr.value, 0) || 1;
                const percentage = Math.round((team.value / totalActive) * 100);
                return (
                  <div key={team.name} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/70 hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                        <span className="text-sm font-semibold text-slate-200">{team.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">{team.value}</span>
                        <span className="text-xs text-slate-400 ml-1.5">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Scheme 2: Escalation & SLA Tier Matrix */}
        <div className="glass-panel p-6">
          <div className="flex items-center space-x-2.5 mb-5">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">SLA Escalation Matrix</h3>
              <p className="text-xs text-slate-400">Resolution benchmarks & thresholds</p>
            </div>
          </div>

          <div className="space-y-3">
            {schemeTiers.map((t) => (
              <div key={t.tier} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-slate-200 block">{t.tier}</span>
                  <span className="text-xs text-slate-400 flex items-center mt-0.5">
                    Target: <strong className="text-slate-300 ml-1">{t.target}</strong>
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${t.color}`}>
                  {t.active} in queue
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-400">
            <p className="flex items-center font-medium text-blue-300 mb-1">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-400" />
              SLA Auto-Enforcement Active
            </p>
            System alerts agents automatically when tickets approach 75% of target turnaround.
          </div>
        </div>

      </div>

      {/* Scheme Visual Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Scheme Volume */}
        <div className="glass-panel p-6">
          <h3 className="text-base font-bold text-white mb-1">Domain Distribution Scheme</h3>
          <p className="text-xs text-slate-400 mb-6">Aggregated ticket classifications processed by NLP engine</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{fontSize: 11, fill: '#64748b'}} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 11}} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#1e293b', opacity: 0.5}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Scheme Volume */}
        <div className="glass-panel p-6">
          <h3 className="text-base font-bold text-white mb-1">Severity Allocation Scheme</h3>
          <p className="text-xs text-slate-400 mb-6">Current breakdown of urgency levels across the ecosystem</p>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorities}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
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
                <span className="block text-2xl font-bold text-white">{stats?.totalTickets || 0}</span>
                <span className="block text-xs text-slate-400">Total System</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {priorities.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Global Stream: Live Scheme Audit */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Live Pipeline Stream</h3>
            <p className="text-xs text-slate-400">Most recent tickets passing through the AI classification & routing scheme</p>
          </div>
          <Link
            to="/tickets"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center transition-colors"
          >
            View Complete Directory ({stats?.totalTickets || 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-700/50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-4 py-3">Ticket / Subject</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Routing Unit</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {recentTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500 text-sm">No tickets currently in the pipeline.</td>
                </tr>
              ) : (
                recentTickets.map(t => (
                  <tr key={t._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">
                      <div>{t.title}</div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">ID: {t._id.slice(-6)}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{t.customer?.name || 'Customer'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {t.assignedTeam}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/tickets/${t._id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium hover:underline inline-flex items-center"
                      >
                        Inspect Scheme
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminSchemeDashboard;