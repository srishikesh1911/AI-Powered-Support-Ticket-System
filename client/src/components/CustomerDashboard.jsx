import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Ticket, PlusCircle, Clock, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerTickets = async () => {
      try {
        const { data } = await api.get('/tickets');
        setTickets(data.tickets || []);
      } catch (err) {
        console.error('Failed to load customer tickets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerTickets();
  }, []);

  const openTickets = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  return (
    <div className="space-y-7 animate-in fade-in duration-500">
      
      {/* Customer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
            Customer Support Center
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400 text-sm mt-1">Track your active inquiries, review agent responses, or create a new request.</p>
        </div>

        <Link
          to="/create-ticket"
          className="flex items-center text-sm font-semibold px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Support Ticket
        </Link>
      </div>

      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Requests</span>
            <Ticket className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{tickets.length}</p>
          <p className="text-xs text-slate-400 mt-1">All submitted tickets</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Progress</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400 mt-2">{openTickets.length}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting resolution</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resolved</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{resolvedTickets.length}</p>
          <p className="text-xs text-slate-400 mt-1">Completed inquiries</p>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
            Your Recent Support Inquiries
          </h2>
          <Link to="/tickets" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center">
            View All ({tickets.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading your tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>You have not submitted any support tickets yet.</p>
            <Link to="/create-ticket" className="mt-3 inline-block text-xs font-semibold text-blue-400 hover:underline">
              Submit your first ticket now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {tickets.slice(0, 5).map(t => (
              <div key={t._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 px-3 rounded-lg transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-500 uppercase">#{t._id.slice(-6)}</span>
                    <h3 className="text-sm font-semibold text-slate-200">{t.title}</h3>
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{t.description}</p>
                </div>
                <Link
                  to={`/tickets/${t._id}`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center self-end sm:self-auto"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CustomerDashboard;