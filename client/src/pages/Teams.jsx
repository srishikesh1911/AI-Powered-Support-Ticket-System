import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await api.get('/teams');
        setTeams(data);
      } catch (error) {
        console.error('Failed to fetch teams', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400">Loading team workloads...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Teams Workload</h1>
        <p className="text-slate-400 text-sm mt-1">Manage support teams and monitor capacity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="glass-panel p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all pointer-events-none"></div>
            
            <div className="flex items-center space-x-3 mb-4 relative z-10">
              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
                <Users className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <p className="text-xs text-slate-400">{team.description}</p>
              </div>
            </div>

            <div className="space-y-4 mt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-blue-400" />
                  Open Tickets
                </div>
                <span className="font-semibold text-white">{team.openTickets}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                  Critical Load
                </div>
                <span className="font-semibold text-red-400">{team.criticalTickets}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                  Total Resolved
                </div>
                <span className="font-semibold text-white">{team.totalTickets - team.openTickets}</span>
              </div>
            </div>

            {/* Workload Progress Bar */}
            <div className="mt-6 pt-4 border-t border-slate-700/50 relative z-10">
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <span className="text-slate-400">Current Workload</span>
                <span className={team.openTickets > 10 ? 'text-amber-400' : 'text-green-400'}>
                  {team.openTickets > 10 ? 'Heavy' : 'Normal'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${team.openTickets > 10 ? 'bg-amber-500' : 'bg-green-500'}`} 
                  style={{ width: `${Math.min(100, (team.openTickets / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
