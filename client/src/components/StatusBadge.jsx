const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Pending':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]';
      case 'Closed':
        return 'bg-slate-700/30 text-slate-400 border-slate-600';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Resolved' ? 'bg-green-400' : 'bg-current opacity-70'}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
