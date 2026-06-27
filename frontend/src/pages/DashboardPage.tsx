import { useState, useEffect } from "react";
import { Play, Pause, StopCircle, Users, ExternalLink, Clock, AlertTriangle } from "lucide-react";

export function DashboardPage() {
  const [adbDevices, setAdbDevices] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState(false);

  // Auto Comment State
  const [scriptsText, setScriptsText] = useState("Mọi người bấm thả tim góc phải màn hình ủng hộ shop nha ❤️\nNhấn đúp màn hình thả tim cho shop với ạ!\nAnh chị thả tim cho phiên live để shop lên deal sốc nhé");
  const [intervalSeconds, setIntervalSeconds] = useState(5);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // Auto Comment Loop Effect
  useEffect(() => {
    let timer: number;
    
    if (isAutoRunning) {
      const lines = scriptsText.split('\n').map(l => l.trim()).filter(l => l);
      
      if (lines.length === 0) {
        setIsAutoRunning(false);
        setCountdown(0);
        return;
      }

      // Ensure index is within bounds (in case text was edited while running)
      const safeIndex = currentLineIndex % lines.length;

      if (countdown > 0) {
        timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        // Time to send!
        const textToSend = lines[safeIndex];
        
        // Send to ADB
        if (adbDevices.length > 0) {
          adbDevices.forEach(device => {
            fetch("http://localhost:8000/api/adb/devices/send-comment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ device_id: device, text: textToSend })
            }).catch(e => console.error("ADB Error:", e));
          });
        }
        
        // Move to next line (looping infinitely) and reset countdown
        setCurrentLineIndex((safeIndex + 1) % lines.length);
        setCountdown(intervalSeconds);
      }
    }
    
    return () => clearTimeout(timer);
  }, [isAutoRunning, countdown, currentLineIndex, intervalSeconds, scriptsText, adbDevices]);

  return (
    <div className="h-full flex flex-col">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-100">Boxphone Auto Seeding</h2>
            <span className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider">
              PRO VERSION
            </span>
          </div>
          <p className="text-sm text-slate-400">Hệ thống điều khiển comment tự động qua ADB</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-300">
            Trạng thái: {adbDevices.length > 0 ? <span className="text-green-400 font-medium">{adbDevices.length} máy sẵn sàng</span> : <span className="text-slate-500">Chưa quét thiết bị</span>}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Column: Alerts & Script Runner */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-brand-primary flex items-center gap-2">
              <Play size={20} /> Auto Comment Configuration
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm text-slate-400">Comment Scripts (Mỗi dòng 1 comment)</label>
                <button 
                  onClick={() => setCurrentLineIndex(0)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                  disabled={isAutoRunning}
                >
                  Reset Progress
                </button>
              </div>
              <textarea 
                value={scriptsText}
                onChange={(e) => setScriptsText(e.target.value)}
                disabled={isAutoRunning}
                className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-brand-primary/50 resize-none font-medium leading-relaxed"
                placeholder="Nhập nội dung comment vào đây..."
              />
            </div>

            <div className="flex items-end gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Delay (giây)</label>
                <input 
                  type="number" 
                  value={intervalSeconds}
                  onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                  disabled={isAutoRunning}
                  className="w-24 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-brand-primary/50 text-center font-bold text-lg"
                  min={1}
                />
              </div>
              <div className="flex-1">
                {!isAutoRunning ? (
                  <button 
                    onClick={() => {
                      if (adbDevices.length === 0) {
                        alert("Vui lòng Quét USB trước khi chạy Auto!");
                        return;
                      }
                      const lines = scriptsText.split('\n').filter(l => l.trim());
                      if (lines.length === 0) {
                        alert("Vui lòng nhập ít nhất 1 comment!");
                        return;
                      }
                      if (currentLineIndex >= lines.length) {
                        setCurrentLineIndex(0);
                      }
                      setCountdown(0); // Fire immediately on start
                      setIsAutoRunning(true);
                    }}
                    className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95 text-lg"
                  >
                    Start Auto Comment
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsAutoRunning(false)}
                    className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95 text-lg flex items-center justify-center gap-2"
                  >
                    <StopCircle size={20} /> Stop Auto (Sending next in {countdown}s)
                  </button>
                )}
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Tiến độ: {Math.min(currentLineIndex, scriptsText.split('\n').filter(l=>l.trim()).length)} / {scriptsText.split('\n').filter(l=>l.trim()).length} comments</span>
              {isAutoRunning && <span className="text-brand-accent animate-pulse font-medium">Running...</span>}
            </div>
          </div>
        </div>

        {/* Right Column: Team & Stats */}
        <div className="col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <Users size={20} className="text-blue-400" />
                  <h2 className="text-lg font-medium">Boxphone Devices</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={async () => {
                      if (adbDevices.length > 0) {
                        try {
                          await fetch("http://localhost:8000/api/adb/devices/setup-keyboard", { method: "POST" });
                          alert("Đã ép bật ADB Keyboard thành công cho " + adbDevices.length + " máy!");
                        } catch(e) {
                          alert("Lỗi khi bật keyboard!");
                        }
                      }
                    }}
                    className="text-xs bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Fix Keyboard
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch("http://localhost:8000/api/adb/devices/scan");
                        const data = await res.json();
                        if (Array.isArray(data)) {
                          setAdbDevices(data);
                        } else {
                          alert("Lỗi quét thiết bị: " + JSON.stringify(data));
                          setAdbDevices([]);
                        }
                      } catch (e) {
                        console.error(e);
                        alert("Không thể kết nối Backend");
                      }
                    }}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Scan USB
                  </button>
                </div>
              </div>
            
            <div className="space-y-4">
              {adbDevices.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No devices found. Click Scan USB.</div>
              ) : (
                adbDevices.map((dev: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center font-bold text-xs">{idx+1}</div>
                      <div>
                        <p className="font-medium text-sm">{dev}</p>
                        <p className="text-xs text-slate-400">Status: Ready (ADB)</p>
                      </div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex-1">
             <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Clock size={18} className="text-brand-accent" /> 
              Upcoming Queue
            </h3>
            <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-700/50">
              {(() => {
                const lines = scriptsText.split('\n').map(l => l.trim()).filter(l => l);
                const upcoming = lines.slice(currentLineIndex, currentLineIndex + 5);
                if (upcoming.length === 0) {
                  return <p className="text-sm text-slate-500 pl-8">Hết kịch bản.</p>;
                }
                return upcoming.map((line, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 ${idx === 0 && isAutoRunning ? 'border-brand-accent animate-pulse' : 'border-slate-600'} flex items-center justify-center z-10`}>
                      <div className={`w-2 h-2 rounded-full ${idx === 0 && isAutoRunning ? 'bg-brand-accent' : 'bg-slate-600'}`}></div>
                    </div>
                    <p className={`text-sm font-medium ${idx === 0 && isAutoRunning ? 'text-white' : 'text-slate-400'}`}>
                      {idx === 0 && isAutoRunning ? `Sending in ${countdown}s` : `Queue #${currentLineIndex + idx + 1}`}
                    </p>
                    <p className="text-sm text-slate-300 mt-1 truncate">"{line}"</p>
                  </div>
                ));
              })()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
