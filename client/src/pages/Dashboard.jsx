import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminSchemeDashboard from '../components/AdminSchemeDashboard';
import AgentSolutionDashboard from '../components/AgentSolutionDashboard';
import CustomerDashboard from '../components/CustomerDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Admin sees the Overall Operational & Routing Scheme
  if (user.role === 'Admin') {
    return <AdminSchemeDashboard />;
  }

  // Support Agent accesses and clears solutions directly
  if (user.role === 'Support Agent') {
    return <AgentSolutionDashboard />;
  }

  // Customer portal view
  return <CustomerDashboard />;
};

export default Dashboard;