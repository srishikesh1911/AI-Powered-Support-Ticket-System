import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from './../components/PriorityBadge';
import { 
  ArrowLeft, BrainCircuit, MessageSquare, Clock, ShieldCheck, UserCircle, 
  Send, Sparkles, Check, Edit2, RefreshCw, AlertTriangle
} from 'lucide-react';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Quick actions
  const [reply, setReply] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTicketAndMessages = async () => {
    try {
      const [ticketRes, messagesRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/tickets/${id}/messages`)
      ]);
      setTicket(ticketRes.data);
      setMessages(messagesRes.data || []);
      if (ticketRes.data.suggestedResponse && !reply) {
        setReply(ticketRes.data.suggestedResponse);
      }
    } catch (error) {
      toast.error('Failed to load ticket details');
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketAndMessages();
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

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      setIsUpdating(true);
      const { data: newMsg } = await api.post(`/tickets/${id}/messages`, {
        message: reply.trim()
      });
      setMessages(prev => [...prev, newMsg]);
      toast.success('Message sent to customer!');
      setReply('');
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Could not send message.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Dedicated Agent Action: Deliver Solution & Clear Ticket
  const handleClearAndResolve = async () => {
    const solutionText = reply.trim() || ticket?.suggestedResponse;
    if (!solutionText) {
      toast.error('Please enter a solution before resolving.');
      return;
    }

    try {
      setIsUpdating(true);
      // 1. Post solution message
      const { data: newMsg } = await api.post(`/tickets/${id}/messages`, {
        message: solutionText
      });
      setMessages(prev => [...prev, newMsg]);

      // 2. Mark ticket as resolved
      const { data: updatedTicket } = await api.put(`/tickets/${id}`, {
        status: 'Resolved'
      });
      setTicket(updatedTicket);
      setReply('');
      toast.success('Solution delivered & Ticket Cleared as Resolved!');
    } catch (error) {
      console.error('Failed to clear solution:', error);
      toast.error('Failed to resolve ticket.');
    } finally {
      setIsUpdating(false);
    }
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
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">{ticket.title}</h1>
                <p className="text-slate-400 text-sm mt-2 flex items-center">
                  <span className="uppercase text-xs tracking-wider font-semibold mr-2 px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    #{ticket._id.substring(ticket._id.length - 8)}
                  </span>
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
              Conversation & Resolution Thread ({messages.length + 1})
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* Customer original issue */}
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium text-xs border border-slate-700 mr-3 flex-shrink-0">
                  {ticket.customer?.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 bg-slate-800/40 rounded-2xl rounded-tl-none p-4 border border-slate-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-slate-300">{ticket.customer?.name} (Original Request)</p>
                    <span className="text-slate-500 text-[10px]">{new Date(ticket.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{ticket.description}</p>
                </div>
              </div>

              {/* Thread messages */}
              {messages.map(msg => {
                const isAgentMsg = msg.sender?.role === 'Support Agent' || msg.sender?.role === 'Admin';
                return (
                  <div key={msg._id} className="flex items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs border mr-3 flex-shrink-0 ${
                      isAgentMsg 
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {msg.sender?.name?.charAt(0) || (isAgentMsg ? 'A' : 'C')}
                    </div>
                    <div className={`flex-1 rounded-2xl rounded-tl-none p-4 border ${
                      isAgentMsg 
                        ? 'bg-emerald-950/20 border-emerald-500/30' 
                        : 'bg-slate-800/40 border-slate-700/50'
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <p className={`text-xs font-semibold ${isAgentMsg ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {msg.sender?.name || 'Support Team'} 
                          {isAgentMsg && <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">Official Solution</span>}
                        </p>
                        <span className="text-slate-500 text-[10px]">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-200 text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply / Resolution Clearance Box */}
            <form onSubmit={handleSendReply} className="mt-8 relative border-t border-slate-800 pt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {isAgentOrAdmin ? 'Deliver Solution or Reply to Customer' : 'Add comment to your ticket'}
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
                placeholder={isAgentOrAdmin ? "Review AI suggested solution or type your customized resolution..." : "Type your message..."}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3">
                <div className="text-xs text-slate-500 flex items-center">
                  {isAgentOrAdmin && <Sparkles className="w-3 h-3 text-cyan-400 mr-1" />}
                  {isAgentOrAdmin ? 'AI solution ready. You can send as standard reply or Clear & Resolve.' : ''}
                </div>
                
                <div className="flex items-center space-x-2.5">
                  <button
                    type="submit"
                    disabled={!reply.trim() || isUpdating}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium text-xs transition-colors flex items-center disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Send Reply
                  </button>

                  {isAgentOrAdmin && ticket.status !== 'Resolved' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={handleClearAndResolve}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all flex items-center disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Clear & Resolve Solution
                    </button>
                  )}
                </div>
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
                AI Analysis & Scheme
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Classification Domain</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-200">{ticket.category}</span>
                    <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      {Math.round((ticket.aiConfidence || 0.94) * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Severity / Urgency</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-200">{ticket.priority}</span>
                    <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      {Math.round((ticket.aiConfidence || 0.94) * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Routed Team</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-200">{ticket.assignedTeam}</span>
                    <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                      {Math.round((ticket.aiConfidence || 0.94) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1.5">Detected Sentiment</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${sentimentColor}`}>
                    {ticket.sentiment || 'Neutral'}
                  </span>
                </div>
                
                {ticket.priority === 'Critical' && (
                  <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-300">Critical SLA: 2-Hour response window.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Status Modifiers */}
          {isAgentOrAdmin && (
            <div className="glass-panel p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Triage</h3>
              
              <div className="space-y-2.5">
                {ticket.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleUpdateStatus('Resolved')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Mark Resolved
                  </button>
                )}
                
                {ticket.status !== 'In Progress' && ticket.status !== 'Resolved' && (
                  <button 
                    onClick={() => handleUpdateStatus('In Progress')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Set In Progress
                  </button>
                )}

                {ticket.status !== 'Closed' && (
                  <button 
                    onClick={() => handleUpdateStatus('Closed')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center bg-slate-800 text-slate-400 border border-slate-700 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TicketDetails;