import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { 
  ArrowLeft, BrainCircuit, MessageSquare, Clock, ShieldCheck, UserCircle, 
  Send, Sparkles, Check, Edit2, RefreshCw, AlertTriangle
} from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Quick actions
  const [reply, setReply] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await api.get(`/tickets/${id}`);
        setTicket(data);
        if (data.suggestedResponse) {
          setReply(data.suggestedResponse);
        }
      } catch (error) {
        toast.error('Failed to load ticket details');
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, navigate]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setIsUpdating(true);
      const { data } = await api.put(`/tickets/${id}`, { status: newStatus });
      setTicket(data);
      toast.success(`Ticket marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update ticket status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    toast.success('Reply sent successfully (Demo)');
    setReply('');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-slate-400">Loading ticket parameters...</p>
    </div>
  );

  if (!ticket) return null;

  const isAgentOrAdmin = user?.role !== 'Customer';

  const sentimentColor = 
    ticket.sentiment === 'Positive' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
    ticket.sentiment === 'Negative' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
    'text-blue-400 border-blue-500/30 bg-blue-500/10';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/tickets')}
        className="flex items-center text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Tickets
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column - Main Ticket Info */}
        <div className="flex-1 space-y-6">
          <div className="glass-panel p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">{ticket.title}</h1>
                <p className="text-slate-400 text-sm mt-2 flex items-center">
                  <span className="uppercase text-xs tracking-wider font-semibold mr-2 px-2 py-0.5 rounded bg-slate-800 text-slate-300">#{ticket._id.substring(ticket._id.length - 8)}</span>
                  Created {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 mb-6 text-slate-300 leading-relaxed">
              {ticket.description}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-slate-400">
                <UserCircle className="w-4 h-4 mr-2 text-slate-500" />
                Customer: <span className="text-slate-200 ml-1 font-medium">{ticket.customer?.name}</span>
              </div>
              <div className="flex items-center text-slate-400">
                <ShieldCheck className="w-4 h-4 mr-2 text-slate-500" />
                Team: <span className="text-slate-200 ml-1 font-medium">{ticket.assignedTeam}</span>
              </div>
            </div>
          </div>

          {/* Chat/Reply Thread */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
              Conversation Thread
            </h3>
            
            <div className="space-y-6 mb-6">
              {/* Customer original message */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium text-xs border border-slate-700 mr-3 flex-shrink-0">
                  {ticket.customer?.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 bg-slate-800/40 rounded-2xl rounded-tl-none p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">{ticket.customer?.name} <span className="text-slate-500 text-[10px] ml-2">{new Date(ticket.createdAt).toLocaleTimeString()}</span></p>
                  <p className="text-slate-300 text-sm">{ticket.description}</p>
                </div>
              </div>
            </div>

            {/* Reply Box */}
            <form onSubmit={handleSendReply} className="mt-8 relative">
              <label className="block text-sm font-medium text-slate-400 mb-2">Reply to customer</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                placeholder="Type your response here..."
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-slate-500 flex items-center">
                  {isAgentOrAdmin && <Sparkles className="w-3 h-3 text-blue-400 mr-1" />}
                  {isAgentOrAdmin ? 'AI suggested response loaded' : ''}
                </div>
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - AI Analysis & Actions */}
        <div className="lg:w-80 space-y-6">
          
          {/* AI ANALYSIS PANEL */}
          {isAgentOrAdmin && (
            <div className="glass-panel p-6 border-blue-500/20 ai-glow relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
              
              <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wider mb-6 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2 text-blue-400" />
                AI Analysis
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Classification</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-200">{ticket.category}</span>
                    <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{Math.round((ticket.aiConfidence || 0.94) * 100)}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Priority Prediction</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-200">{ticket.priority}</span>
                    <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{Math.round((ticket.aiConfidence || 0.94) * 100)}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Recommended Team</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-200">{ticket.assignedTeam}</span>
                    <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{Math.round((ticket.aiConfidence || 0.94) * 100)}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-2">Customer Sentiment</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${sentimentColor}`}>
                    {ticket.sentiment || 'Neutral'}
                  </span>
                </div>
                
                {ticket.priority === 'Critical' && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-300">SLA Warning: Ticket requires response within 2 hours.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Agent Actions */}
          {isAgentOrAdmin && (
            <div className="glass-panel p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Ticket Actions</h3>
              
              <div className="space-y-3">
                {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                  <button 
                    onClick={() => handleUpdateStatus('Resolved')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </button>
                )}
                
                {ticket.status !== 'In Progress' && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                  <button 
                    onClick={() => handleUpdateStatus('In Progress')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Start Progress
                  </button>
                )}

                <button 
                  onClick={() => handleUpdateStatus('Closed')}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center bg-slate-800 text-slate-400 border border-slate-700 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 px-4 py-2 rounded-lg font-medium transition-colors mt-4"
                >
                  Close Ticket
                </button>
              </div>
            </div>
          )}

          {/* Ticket Timeline */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Timeline</h3>
            
            <div className="relative border-l border-slate-700/50 ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-600 ring-4 ring-slate-900/60"></div>
                <p className="text-sm text-slate-200">Ticket created</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-900/60 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <p className="text-sm text-slate-200">AI Analysis completed</p>
                <p className="text-xs text-slate-500 mt-1">Routed to {ticket.assignedTeam}</p>
              </div>

              {ticket.resolvedAt && (
                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-green-500 ring-4 ring-slate-900/60 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <p className="text-sm text-slate-200">Ticket resolved</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(ticket.resolvedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
