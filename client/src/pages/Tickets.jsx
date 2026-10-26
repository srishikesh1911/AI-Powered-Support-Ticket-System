import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

const Tickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [category, setCategory] = useState('All');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tickets?page=${page}&limit=10&search=${search}&status=${status}&priority=${priority}&category=${category}`);
      setTickets(data.tickets);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, status, priority, category]); // fetch when filters change

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Tickets</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and resolve customer support requests</p>
        </div>
        {user?.role === 'Customer' && (
          <Link to="/create-ticket" className="bg-blue-600/20 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-blue-400 font-medium px-4 py-2.5 rounded-lg hover:bg-blue-600/30 transition-all flex items-center">
            <span className="text-lg mr-2">+</span> New Ticket
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 flex flex-wrap gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-3">
          <Filter className="text-slate-500 w-5 h-5" />
          
          <select 
            value={status} 
            onChange={(e) => {setStatus(e.target.value); setPage(1)}}
            className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none min-w-[120px]"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <select 
            value={priority} 
            onChange={(e) => {setPriority(e.target.value); setPage(1)}}
            className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none min-w-[120px]"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-700/50 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-6 py-4">Ticket details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                      <span className="text-slate-400">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">No tickets found.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200 flex items-center">
                        {ticket.title}
                        {ticket.aiConfidence > 0.8 && <Sparkles className="w-3 h-3 text-amber-400 ml-2" />}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 uppercase">ID: {ticket._id.substring(ticket._id.length - 6)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">{ticket.customer?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 shadow-sm">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/tickets/${ticket._id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 rounded-lg border border-transparent transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-800/50 bg-slate-900/30 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 disabled:opacity-30 hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
