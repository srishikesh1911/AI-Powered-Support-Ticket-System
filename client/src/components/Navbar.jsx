import { useContext, useState } from 'react';
import { Bell, Search, Menu, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-slate-900/40 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 sticky top-0 z-30">
      
      <div className="flex items-center flex-1">
        {/* Mobile menu button could go here */}
        <div className="relative w-64 md:w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search AI Command Center..." 
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/50 border border-slate-700/50 rounded-full text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white transition-colors relative focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] border border-slate-900"></span>
          </button>

          {/* Notifications Dropdown (Glassmorphism) */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">2 New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <div className="flex items-start">
                    <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg mr-3 mt-0.5 border border-red-500/20">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Critical ticket detected</p>
                      <p className="text-xs text-slate-400 mt-1">Production server is down (#b332)</p>
                      <p className="text-[10px] text-slate-500 mt-1">10 mins ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <div className="flex items-start">
                    <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg mr-3 mt-0.5 border border-blue-500/20">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">AI analysis completed</p>
                      <p className="text-xs text-slate-400 mt-1">Ticket #9f76 successfully routed</p>
                      <p className="text-[10px] text-slate-500 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 text-center border-t border-slate-700/50 bg-slate-800/30">
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">Mark all as read</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center space-x-3 pl-6 border-l border-slate-700/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-sm font-medium text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
