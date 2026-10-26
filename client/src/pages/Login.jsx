import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full glass-panel p-8 relative z-10 ai-glow">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">AI Command Center</h2>
          <p className="text-slate-400 mt-2 text-sm">Secure Authentication Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="email"
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-3 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                placeholder="agent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-3 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 tracking-widest"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transform hover:-translate-y-0.5"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Demo Credentials</p>
          <p className="text-xs text-slate-300 mb-1">
            <span className="text-blue-400">admin</span>@example.com <span className="text-slate-600 mx-1">|</span> Admin@123
          </p>
          <p className="text-xs text-slate-300 mb-1">
            <span className="text-blue-400">agent</span>@example.com <span className="text-slate-600 mx-1">|</span> Agent@123
          </p>
          <p className="text-xs text-slate-300">
            <span className="text-blue-400">customer</span>@example.com <span className="text-slate-600 mx-1">|</span> Customer@123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
