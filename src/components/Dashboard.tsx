import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Calendar, Bell, Sparkles, X, CheckCircle2, Flame, RefreshCcw } from 'lucide-react';
import { Goals } from './Goals';

export const Dashboard: React.FC = () => {
  const { currentBudget, bills, smartAdjustBudget, streakCount, highLegibility } = useApp();
  const [filter, setFilter] = useState<'Day' | 'Week'>('Day');
  const [showReminder, setShowReminder] = useState(false);
  const [adjustmentResult, setAdjustmentResult] = useState<{ message: string; adjusted: boolean } | null>(null);
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowReminder(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSmartAdjust = async () => {
    setIsAdjusting(true);
    const result = await smartAdjustBudget();
    setAdjustmentResult(result);
    setIsAdjusting(false);
  };

  const allowance = filter === 'Day' ? (currentBudget / 30).toFixed(2) : (currentBudget / 4).toFixed(2);

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-white/50 font-medium text-sm tracking-widest uppercase">My Money</p>
          <h1 className={`text-3xl font-serif italic text-white ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
            Alex Rivera
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`bg-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 border border-amber-400/20 ${highLegibility ? 'border-2 border-amber-400' : ''}`}>
            <Flame size={18} color="#fbbf24" fill="#fbbf24" />
            <span className="text-amber-400 font-bold">{streakCount}</span>
          </div>
          <div className={`w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center ${highLegibility ? 'border-2 border-white' : ''}`}>
            <Wallet size={24} color="white" />
          </div>
        </div>
      </div>

      {/* Spending Allowance Card */}
      <div className={`bg-[#1A1A1A] rounded-[40px] p-8 relative overflow-hidden border border-white/10 ${highLegibility ? 'border-2 border-white' : ''}`}>
        <div className="z-10 relative">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Daily Budget</span>
            <div className="bg-white/5 border border-white/10 rounded-full px-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'Day' | 'Week')}
                className="bg-transparent text-white text-sm py-2 px-1 outline-none cursor-pointer"
              >
                <option value="Day" className="bg-[#1A1A1A]">Day</option>
                <option value="Week" className="bg-[#1A1A1A]">Week</option>
              </select>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`text-6xl font-light tracking-tighter text-white font-serif italic ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
              ${allowance}
            </span>
            <span className="text-white/30 font-medium text-sm">left</span>
          </div>

          <button
            onClick={handleSmartAdjust}
            disabled={isAdjusting}
            className="mt-8 flex items-center gap-2 bg-white px-6 py-3 rounded-2xl cursor-pointer border-none hover:bg-white/90 transition-colors disabled:opacity-60"
          >
            {isAdjusting ? (
              <RefreshCcw size={14} color="black" className="animate-spin" />
            ) : (
              <Sparkles size={14} color="black" />
            )}
            <span className="text-black text-xs font-bold">
              {isAdjusting ? "Analyzing..." : "Optimize My Budget"}
            </span>
          </button>
        </div>
        {/* Decorative */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
      </div>

      {/* Goals Section */}
      <div className="mt-8">
        <Goals />
      </div>

      {/* Upcoming Bills */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} color="rgba(255, 255, 255, 0.6)" />
            <span className="font-medium text-white/60 text-xs uppercase tracking-widest">Upcoming Bills</span>
          </div>
          <button className="bg-transparent border-none cursor-pointer">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">View all</span>
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5 ${highLegibility ? 'border-2 border-white' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center">
                  <Bell size={16} color="rgba(255, 255, 255, 0.4)" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">{bill.title}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider">
                    Due {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`font-serif italic text-base text-white ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
                ${bill.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Adjustment Result Modal */}
      {!!adjustmentResult && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] w-full max-w-sm rounded-[48px] p-10 flex flex-col items-center relative border border-white/10">
            <button
              onClick={() => setAdjustmentResult(null)}
              className="absolute right-8 top-8 bg-transparent border-none cursor-pointer"
            >
              <X size={24} color="rgba(255, 255, 255, 0.2)" />
            </button>

            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${adjustmentResult.adjusted ? 'bg-white/10' : 'bg-white/5'}`}>
              {adjustmentResult.adjusted ?
                <Sparkles size={48} color="white" /> :
                <CheckCircle2 size={48} color="rgba(255, 255, 255, 0.2)" />
              }
            </div>

            <h2 className="text-3xl font-serif italic text-white mb-4 text-center">
              {adjustmentResult.adjusted ? "Portfolio Optimized" : "Peak Efficiency"}
            </h2>

            <p className="text-white/50 mb-10 text-center leading-relaxed text-sm">
              {adjustmentResult.message}
            </p>

            <button
              onClick={() => setAdjustmentResult(null)}
              className="w-full bg-white py-5 rounded-[32px] flex items-center justify-center cursor-pointer border-none hover:bg-white/90 transition-colors"
            >
              <span className="text-black font-bold">Acknowledge</span>
            </button>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminder && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A1A] w-full max-w-sm rounded-[48px] p-10 flex flex-col items-center border border-white/10">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8">
              <Bell size={40} color="white" />
            </div>
            <h2 className="text-3xl font-serif italic text-white mb-4 text-center">Obligation Alert</h2>
            <p className="text-white/50 mb-10 text-center leading-relaxed text-sm">
              Your rent payment of <strong className="text-white">$1,200</strong> is due soon. Shall we secure the funds?
            </p>
            <div className="w-full flex flex-col gap-4">
              <button
                onClick={() => setShowReminder(false)}
                className="w-full bg-white py-5 rounded-[32px] flex items-center justify-center cursor-pointer border-none hover:bg-white/90 transition-colors"
              >
                <span className="text-black font-bold">Secure Funds</span>
              </button>
              <button
                onClick={() => setShowReminder(false)}
                className="w-full flex items-center justify-center py-2 bg-transparent border-none cursor-pointer"
              >
                <span className="text-white/30 font-bold text-xs uppercase tracking-widest">Defer Notification</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
