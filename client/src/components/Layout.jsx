import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Abstract Background pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <Navbar />
        <main className="flex-1 p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
