const PriorityBadge = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)]';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]';
      case 'Low':
        return 'bg-slate-700/30 text-slate-300 border-slate-600';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStyles()}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
