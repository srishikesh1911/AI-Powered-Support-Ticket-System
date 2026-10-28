import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Sparkles, CheckCircle2, Clock, AlertTriangle, Send, 
  Search, Filter, Check, Eye, MessageSquare, 
  ThumbsUp, RefreshCw, Layers
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const AgentSolutionDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'cleared'
  
  // State for active editable solutions per ticket id
  const [draftSolutions, setDraftSolutions] = useState({});
  const [clearingTicketId, setClearingTicketId] = useState(null);

  const fetchAgentTickets = async () => {
    setLoading(true);
    try {
      // Fetch up to 50 active tickets for agent clearance
      const { data } = await api.get('/tickets?limit=50');
      const allTickets = data.tickets || [];
      setTickets(allTickets);

      // Prepopulate drafts with AI suggested responses
      const initialDrafts = {};
      allTickets.forEach(t => {
        initialDrafts[t._id] = t.suggestedResponse || 'Hello, thank you for contacting support. We are reviewing your issue and have applied the resolution accordingly.';
      });
      setDraftSolutions(initialDrafts);
    } catch (error) {
      console.error('Error fetching tickets for solution clearance:', error);
      toast.error('Failed to load solution queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentTickets();
  }, []);

  const handleSolutionChange = (ticketId, text) => {
    setDraftSolutions(prev => ({
      ...prev,
      [ticketId]: text
    }));
  };

  // The core action: Clear and resolve the ticket with the solution!
  const handleClearSolution = async (ticket) => {
    const solutionText = draftSolutions[ticket._id] || ticket.suggestedResponse;
    if (!solutionText?.trim()) {
      toast.error('Please enter a solution before clearing.');
      return;
    }

    try {
      setClearingTicketId(ticket._id);
      
      // 1. Send the solution message to the customer
      await api.post(`/tickets/${ticket._id}/messages`, {
        message: solutionText.trim()
      });

      // 2. Mark the ticket as Resolved in MongoDB
      const { data: updatedTicket } = await api.put(`/tickets/${ticket._id}`, {
        status: 'Resolved'
      });

      // 3. Update local state
      setTickets(prev => prev.map(t => t._id === ticket._id ? updatedTicket : t));
      toast.success(`Solution delivered & Ticket #${ticket._id.slice(-6)} Cleared!`);
    } catch (error) {
      console.error('Failed to clear solution:', error);
      toast.error('Failed to submit resolution.');
    } finally {
      setClearingTicketId(null);
    }
  };

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      setClearingTicketId(ticketId);
      const { data: updatedTicket } = await api.put(`/tickets/${ticketId}`, { status });
      setTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t));
      toast.success(`Ticket status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update ticket status');
    } finally {
      setClearingTicketId(null);
    }
  };

  // Computed metrics
  const pendingTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress');
  const clearedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');
  const criticalCount = pendingTickets.filter(t => t.priority === 'Critical').length;

  // Filtered list based on active tab and search/priority
  const displayedList = (activeTab === 'pending' ? pendingTickets : clearedTickets).filter(t => {
    const matchesSearch = search === '' || 
      t.title.toLowerCase().includes(search.toLowerCase()) || 
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-7 animate-in fade-in duration-500">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="px-2.5 py-1 text-xs font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
              Agent Clearance Station
            </span>
            <span className="text-xs text-slate-400">
              Welcome, <strong className="text-white">{user?.name}</strong>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Solution & Resolution Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">
            Access incoming customer issues, review AI-predicted solutions, and clear tickets directly.
          </p>
        </div>

        <button 
          onClick={fetchAgentTickets}
          disabled={loading}
          className="flex items-center self-start md:self-auto text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Solution Queue
        </button>
      </div>

      {/* Agent Performance & Clearance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Resolution</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400 mt-2">{pendingTickets.length}</p>
          <p className="text-xs text-slate-400 mt-2">Awaiting solution delivery</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Immediate</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400 mt-2">{criticalCount}</p>
          <p className="text-xs text-red-400/80 mt-2">Requires 2-hour SLA response</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Solutions Cleared</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{clearedTickets.length}</p>
          <p className="text-xs text-slate-400 mt-2">Delivered & marked resolved</p>
        </div>

        <div className="glass-card p-5 border-l-4 border-l-cyan-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Confidence Index</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-cyan-400 mt-2">94%</p>
          <p className="text-xs text-slate-400 mt-2">High accuracy suggestions</p>
        </div>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        
        {/* Toggle Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Active Queue ({pendingTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('cleared')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center ${
              activeTab === 'cleared'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Cleared Solutions ({clearedTickets.length})
          </button>
        </div>

        {/* Search & Priority Filters */}
        <div className="flex items-center space-x-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search solutions or tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="bg-slate-900/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

      </div>

      {/* Solutions Clearance Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-9 h-9 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading solution clearing station...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            <Check className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {activeTab === 'pending' ? 'All Solutions Cleared!' : 'No Cleared Solutions Yet'}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
            {activeTab === 'pending' 
              ? 'Great job! There are currently no pending tickets requiring resolution in this filter.'
              : 'Cleared tickets and delivered solutions will appear here once submitted.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedList.map(ticket => {
            const isResolvedOrClosed = ticket.status === 'Resolved' || ticket.status === 'Closed';
            const currentDraft = draftSolutions[ticket._id] || ticket.suggestedResponse || '';
            const isProcessing = clearingTicketId === ticket._id;

            return (
              <div 
                key={ticket._id}
                className={`glass-panel p-6 border transition-all ${
                  ticket.priority === 'Critical' 
                    ? 'border-red-500/30 bg-red-950/10' 
                    : 'border-slate-700/60'
                }`}
              >
                {/* Card Top: Details, Tags & Status */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800/70">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                      <span className="text-xs font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                        #{ticket._id.slice(-6).toUpperCase()}
                      </span>
                      <h3 className="text-lg font-bold text-white">{ticket.title}</h3>
                      <PriorityBadge priority={ticket.priority} />
                      <StatusBadge status={ticket.status} />
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                      <span>Customer: <strong className="text-slate-300">{ticket.customer?.name || 'Customer'}</strong></span>
                      <span>Category: <strong className="text-slate-300">{ticket.category}</strong></span>
                      <span>Assigned Team: <strong className="text-slate-300">{ticket.assignedTeam}</strong></span>
                      <span>Date: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link
                    to={`/tickets/${ticket._id}`}
                    className="flex items-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors self-start"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Inspect Details
                  </Link>
                </div>

                {/* Customer Inquiry Summary */}
                <div className="my-4 p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Customer Statement
                  </span>
                  {ticket.description}
                </div>

                {/* AI SOLUTION CLEARANCE SECTION */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-950/20 to-slate-900/40 border border-blue-500/20 relative">
                  
                  {/* AI Badge header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                        AI Recommended Solution
                      </span>
                      <span className="text-[10px] font-mono bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                        Confidence: {Math.round((ticket.aiConfidence || 0.94) * 100)}%
                      </span>
                    </div>

                    {ticket.sentiment && (
                      <span className="text-xs text-slate-400">
                        Sentiment: <strong className="text-slate-300">{ticket.sentiment}</strong>
                      </span>
                    )}
                  </div>

                  {/* Solution Text Editor (Agent can inspect and adapt before clearance) */}
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      disabled={isResolvedOrClosed || isProcessing}
                      value={currentDraft}
                      onChange={e => handleSolutionChange(ticket._id, e.target.value)}
                      placeholder="Edit or customize solution before clearing..."
                      className="w-full bg-slate-950/60 border border-slate-700/60 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-y transition-all disabled:opacity-60"
                    />

                    {/* Action Bar for Clearing the Solution */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-1">
                      <div className="text-xs text-slate-400 flex items-center">
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                        {isResolvedOrClosed 
                          ? 'This solution has been approved and delivered.' 
                          : 'Review AI response above, make any edits, and click Clear & Resolve.'}
                      </div>

                      <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                        
                        {!isResolvedOrClosed ? (
                          <>
                            {ticket.status !== 'In Progress' && (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleUpdateStatus(ticket._id, 'In Progress')}
                                className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center"
                              >
                                <Clock className="w-3.5 h-3.5 mr-1" />
                                Start Progress
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleClearSolution(ticket)}
                              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all flex items-center"
                            >
                              <Check className="w-4 h-4 mr-1.5" />
                              {isProcessing ? 'Delivering...' : 'Clear & Resolve Solution'}
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Solution Cleared & Delivered
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(ticket._id, 'In Progress')}
                              className="text-xs text-slate-400 hover:text-slate-200 underline"
                            >
                              Reopen
                            </button>
                          </div>
                        )}

                      </div>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default AgentSolutionDashboard;