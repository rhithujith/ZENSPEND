import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, LogOut, ChevronRight, History, Zap, ShieldAlert, UtensilsCrossed, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const Profile: React.FC = () => {
  const { transactions, isExamModeActive, setExamMode, highLegibility, toggleLegibility, logout, isFirebaseActive, user, loginWithGoogle, getGroqAdvice } = useApp();
  const [showHistory, setShowHistory] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const handleAskGroq = async () => {
    setIsAsking(true);
    const res = await getGroqAdvice("Give me a quick financial tip for a Gen Z student who wants to save for a trip to Japan.");
    setAdvice(res);
    setIsAsking(false);
  };

  const data = [
    { name: 'Needs', value: 50, color: '#ffffff' },
    { name: 'Savings', value: 30, color: '#a1a1aa' },
    { name: 'Wants', value: 20, color: '#3f3f46' },
  ];

  const plan = "Great job managing your budget! Keep tracking your spending to reach your goals faster.";

  // Simple Pie Chart calculation
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex-1 bg-black p-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={cn("text-3xl font-serif italic text-white", highLegibility && "font-sans not-italic font-bold")}>
          My Profile
        </h1>
        <div className="flex gap-2">
          <button
            onClick={toggleLegibility}
            className={cn("w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer border-none", highLegibility && "bg-white")}
          >
            <span className={cn("text-xs font-bold text-white/60", highLegibility && "text-black")}>Aa</span>
          </button>
          <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer border-none">
            <Settings size={20} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl relative shrink-0">
          <img
            src="https://picsum.photos/seed/alex/200/200"
            alt="Profile"
            className="w-full h-full object-cover grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="flex-1">
          <p className={cn("text-2xl font-serif italic text-white", highLegibility && "font-sans not-italic font-bold")}>
            {user?.displayName || "Alex Rivera"}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Joined 2023</span>
            <div className="flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", isFirebaseActive ? "bg-emerald-500" : "bg-amber-500")} />
              <span className="text-white/20 text-[8px] font-bold uppercase tracking-widest">
                {isFirebaseActive ? (user?.isAnonymous ? "Guest Mode" : "Cloud Synced") : "Local Mode"}
              </span>
            </div>
          </div>
          {isFirebaseActive && user?.isAnonymous && (
            <button
              onClick={loginWithGoogle}
              className="mt-4 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-3 h-3" />
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Sync with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Groq Advice Section */}
      <div className="space-y-4 mb-8">
        <p className="font-medium text-white/40 text-[10px] uppercase tracking-widest px-1">AI Financial Coach</p>
        <div className={cn("bg-white/5 p-6 rounded-[32px] border border-white/5", highLegibility && "bg-white/10")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Sparkles size={20} color="white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Groq Intelligence</p>
                <p className="text-white/30 text-[10px] uppercase tracking-wider">Llama 3.3 Powered</p>
              </div>
            </div>
            <button
              onClick={handleAskGroq}
              disabled={isAsking}
              className={cn("bg-white px-4 py-2 rounded-xl cursor-pointer border-none hover:bg-white/90 transition-colors", isAsking && "opacity-50")}
            >
              <span className="text-black text-[10px] font-bold uppercase tracking-widest">
                {isAsking ? "Thinking..." : "Get Tip"}
              </span>
            </button>
          </div>

          {advice && (
            <div className="pt-4 border-t border-white/5 mt-4">
              <p className="text-white/60 text-sm italic leading-relaxed">"{advice}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Money Flow Chart (SVG pie chart) */}
      <div className={cn("bg-white/5 p-8 rounded-[40px] border border-white/5 mb-8", highLegibility && "bg-white/10")}>
        <p className="font-medium text-white/40 text-[10px] uppercase tracking-widest mb-6">Where my money goes</p>
        <div className="flex items-center justify-center h-64">
          <svg height="200" width="200" viewBox="0 0 200 200">
            <g transform="rotate(-90 100 100)">
              {data.map((item, index) => {
                const angle = (item.value / total) * 360;
                const x1 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
                const y1 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
                const x2 = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                const y2 = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                const largeArcFlag = angle > 180 ? 1 : 0;
                const d = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                currentAngle += angle;
                return (
                  <path key={index} d={d} fill={item.color} stroke="black" strokeWidth="2" />
                );
              })}
              <circle cx="100" cy="100" r="60" fill="black" />
            </g>
          </svg>
        </div>
        <div className="flex justify-between mt-6">
          {data.map((item) => (
            <div key={item.name} className="flex-1 flex flex-col items-center">
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">{item.name}</span>
              <span className={cn("font-serif italic text-lg text-white", highLegibility && "font-sans not-italic font-bold")}>{item.value}%</span>
              <div className="w-full h-0.5 rounded-full mt-3" style={{ backgroundColor: item.color, opacity: 0.3 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Plan */}
      <div className={cn("bg-white/5 rounded-[32px] p-8 mb-8 relative overflow-hidden border border-white/5", highLegibility && "bg-white/10")}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={18} color="rgba(255,255,255,0.4)" />
            <span className="font-medium text-xs text-white uppercase tracking-[0.2em]">My Money Plan</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed font-light italic">"{plan}"</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Study Mode Toggle */}
      <div className={cn("bg-white/5 p-6 rounded-[32px] border border-white/5 flex items-center justify-between mb-8", highLegibility && "bg-white/10")}>
        <div className="flex items-center gap-5">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isExamModeActive ? "bg-white" : "bg-white/5")}>
            <ShieldAlert size={24} color={isExamModeActive ? "black" : "rgba(255,255,255,0.2)"} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Study Mode</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Save extra money while studying</p>
          </div>
        </div>
        {/* HTML toggle switch */}
        <button
          onClick={() => setExamMode(!isExamModeActive)}
          className={`relative w-12 h-6 rounded-full border-none cursor-pointer transition-colors ${isExamModeActive ? 'bg-white' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isExamModeActive ? 'right-1 bg-black' : 'left-1 bg-white/20'}`} />
        </button>
      </div>

      {/* Transaction History Accordion */}
      <div className="space-y-4 mb-8">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex justify-between items-center px-1 bg-transparent border-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <History size={14} color="rgba(255,255,255,0.4)" />
            <span className="font-medium text-white/40 text-[10px] uppercase tracking-widest">Recent Spending</span>
          </div>
          <ChevronRight
            size={20}
            color="rgba(255,255,255,0.2)"
            style={{ transform: showHistory ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          />
        </button>

        {showHistory && (
          <div className="flex flex-col gap-3">
            {transactions.map((t) => (
              <div
                key={t.id}
                className={cn("bg-white/5 p-5 rounded-[32px] flex justify-between items-center border border-white/5", highLegibility && "bg-white/10")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <UtensilsCrossed size={18} color="rgba(255,255,255,0.2)" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.title}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">{t.date}</p>
                  </div>
                </div>
                <span className={cn("font-serif italic text-lg text-white", highLegibility && "font-sans not-italic font-bold")}>
                  -${t.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-3 py-6 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
      >
        <LogOut size={18} color="rgba(255,255,255,0.2)" />
        <span className="text-white/20 font-bold text-[10px] uppercase tracking-[0.3em]">Log Out</span>
      </button>
    </div>
  );
};
