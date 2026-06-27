import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, MessageSquareText, BarChart3, Settings } from "lucide-react";

export function AppShell() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 glass-card m-4 flex flex-col">
        <div className="p-6 border-b border-slate-700/50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            LiveControl
          </h1>
          <p className="text-xs text-slate-400 mt-1">Comment Management</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-brand-primary/20 text-brand-primary font-medium" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/scripts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-brand-primary/20 text-brand-primary font-medium" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`
            }
          >
            <MessageSquareText size={20} />
            <span>Scripts</span>
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-brand-primary/20 text-brand-primary font-medium" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`
            }
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 pl-0">
        <div className="h-full glass-card overflow-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
