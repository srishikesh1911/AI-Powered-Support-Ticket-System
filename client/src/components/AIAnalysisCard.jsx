import { Bot, Check, X, Edit3 } from 'lucide-react';

const AIAnalysisCard = ({ ticket, onUseResponse }) => {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-indigo-900">AI Analysis & Routing</h3>
          <p className="text-xs text-indigo-700">Confidence Score: <span className="font-semibold">{Math.round((ticket.aiConfidence || 0) * 100)}%</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded-lg border border-indigo-50 text-sm">
          <span className="text-slate-500 block text-xs mb-1">Category</span>
          <span className="font-medium text-slate-800">{ticket.category}</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-indigo-50 text-sm">
          <span className="text-slate-500 block text-xs mb-1">Priority</span>
          <span className="font-medium text-slate-800">{ticket.priority}</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-indigo-50 text-sm">
          <span className="text-slate-500 block text-xs mb-1">Severity</span>
          <span className="font-medium text-slate-800">{ticket.severity}</span>
        </div>
        <div className="bg-white p-3 rounded-lg border border-indigo-50 text-sm">
          <span className="text-slate-500 block text-xs mb-1">Assigned Team</span>
          <span className="font-medium text-slate-800">{ticket.assignedTeam}</span>
        </div>
      </div>

      {ticket.suggestedResponse && (
        <div className="bg-white p-4 rounded-lg border border-indigo-100">
          <span className="text-indigo-600 text-xs font-semibold mb-2 block uppercase tracking-wider">Suggested Response</span>
          <div className="text-sm text-slate-700 whitespace-pre-wrap mb-4 font-mono bg-slate-50 p-3 rounded border border-slate-100">
            {ticket.suggestedResponse}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onUseResponse(ticket.suggestedResponse)}
              className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Use Suggestion
            </button>
            <button 
              onClick={() => onUseResponse(ticket.suggestedResponse, true)}
              className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisCard;
