import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import Analytics from './pages/Analytics';
import Teams from './pages/Teams';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/:id" element={<TicketDetails />} />
              
              <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
                <Route path="create-ticket" element={<CreateTicket />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Admin', 'Support Agent']} />}>
                <Route path="analytics" element={<Analytics />} />
                <Route path="teams" element={<Teams />} />
              </Route>
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
