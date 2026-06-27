import { useState, useEffect } from "react";
import { Play, Pause, StopCircle, Users, ExternalLink, Clock, AlertTriangle } from "lucide-react";

export function DashboardPage() {
  const [sessionState, setSessionState] = useState("preparing");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showReminder, setShowReminder] = useState(true);

  useEffect(() => {
    let interval: number;
    if (sessionState === "live") {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold">Launch: Special Summer Sale</h2>
            <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
              sessionState === "live" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-slate-700 text-slate-300"
            }`}>
              {sessionState}
            </span>
          </div>
          <a href="#" className="text-sm text-brand-primary hover:text-blue-400 flex items-center gap-1">
            <ExternalLink size={14} /> tiktok.com/@demo/live
          </a>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Elapsed Time</p>
            <div className="text-3xl font-mono tracking-wider font-semibold text-slate-200">
              {formatTime(elapsedTime)}
            </div>
          </div>
          <div className="flex gap-2">
            {sessionState !== "live" ? (
              <button 
                onClick={() => setSessionState("live")}
                className="bg-brand-primary hover:bg-blue-500 text-white p-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all"
              >
                <Play size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setSessionState("paused")}
                className="bg-amber-500 hover:bg-amber-400 text-white p-3 rounded-lg shadow-lg shadow-amber-500/20 transition-all"
              >
                <Pause size={20} />
              </button>
            )}
            <button 
              onClick={() => setSessionState("ended")}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-all"
            >
              <StopCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Column: Alerts & Script Runner */}
        <div className="col-span-8 flex flex-col gap-6">
          
          {/* Big Reminder Area */}
          {showReminder && (
            <div className="bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/30 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent animate-pulse"></div>
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-brand-primary mb-2">
                    <AlertTriangle size={24} className="animate-bounce" />
                    <h3 className="text-xl font-bold">Time to post!</h3>
                  </div>
                  <p className="text-slate-300">Target Group: <span className="font-semibold text-white bg-slate-800 px-2 py-1 rounded">Engagement</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 mb-1">Priority</p>
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-sm font-medium">HIGH</span>
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 mb-8 shadow-inner">
                <p className="text-3xl font-medium text-white leading-relaxed">
                  "Mọi người bấm thả tim góc phải màn hình ủng hộ shop nha ❤️"
                </p>
              </div>

              {/* Duplicate Warning Warning */}
              <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-sm flex gap-3">
                <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                <div>
                  <p className="font-medium mb-1">Used recently (4 mins ago).</p>
                  <p>Consider using one of these variants instead:</p>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>Nhấn đúp màn hình thả tim cho shop với ạ!</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>Anh chị thả tim cho phiên live để shop lên deal sốc nhé</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowReminder(false)}
                  className="bg-green-500 hover:bg-green-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95 text-lg flex-1"
                >
                  Mark as Sent
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-4 px-6 rounded-xl transition-all active:scale-95 flex-1">
                  Snooze 1 min
                </button>
                <button 
                  onClick={() => setShowReminder(false)}
                  className="bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-300 font-medium py-4 px-6 rounded-xl transition-all active:scale-95 flex-1"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {!showReminder && (
             <div className="flex-1 border-2 border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center text-slate-500">
               <Clock size={48} className="mb-4 opacity-50" />
               <p className="text-lg">Waiting for next scheduled script...</p>
               <button 
                 onClick={() => setShowReminder(true)}
                 className="mt-4 text-sm text-brand-primary hover:underline"
                >
                 [Dev] Trigger Reminder
               </button>
             </div>
          )}

        </div>

        {/* Right Column: Team & Stats */}
        <div className="col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Users size={18} className="text-brand-primary" /> 
              Operations Team
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold">T</div>
                  <div>
                    <p className="font-medium text-sm">Tommy (Coordinator)</p>
                    <p className="text-xs text-slate-400">Device: MacBook Pro</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center font-bold">A</div>
                  <div>
                    <p className="font-medium text-sm">Anna (Operator)</p>
                    <p className="text-xs text-slate-400">Device: iPhone 13</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center font-bold">B</div>
                  <div>
                    <p className="font-medium text-sm">Ben (Operator)</p>
                    <p className="text-xs text-slate-400">Status: Break</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex-1">
             <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Clock size={18} className="text-brand-accent" /> 
              Upcoming Queue
            </h3>
            <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-700/50">
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-brand-accent flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                </div>
                <p className="text-sm font-medium">In 2 mins</p>
                <p className="text-xs text-slate-400 mt-1 truncate">"Hỏi size chiều cao cân nặng..."</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <p className="text-sm font-medium text-slate-300">In 5 mins</p>
                <p className="text-xs text-slate-400 mt-1 truncate">"Chốt đơn gửi voucher..."</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
                <p className="text-sm font-medium text-slate-300">In 12 mins</p>
                <p className="text-xs text-slate-400 mt-1 truncate">"Mini game tặng quà..."</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
