import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Target, Trash2, X, CheckCircle2 } from 'lucide-react';

export const Goals: React.FC = () => {
  const { goals, addGoal, deleteGoal, highLegibility } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '' });

  const handleAdd = () => {
    if (!newGoal.title || !newGoal.targetAmount) return;
    addGoal({
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
    });
    setNewGoal({ title: '', targetAmount: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Target size={14} color="rgba(255, 255, 255, 0.6)" />
          <span className="font-medium text-white/60 text-xs uppercase tracking-widest">My Goals</span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer border-none hover:bg-white/20 transition-colors ${highLegibility ? 'border-2 border-white' : ''}`}
        >
          <Plus size={18} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <div key={goal.id} className={`bg-white/5 p-5 rounded-[32px] border border-white/5 relative ${highLegibility ? 'border-2 border-white' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <Target size={20} color="rgba(255, 255, 255, 0.3)" />
                  </div>
                  <div>
                    <p className={`font-serif italic text-lg text-white ${highLegibility ? 'font-sans not-italic font-bold text-base' : ''}`}>
                      {goal.title}
                    </p>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest">
                      Goal: ${goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-2 cursor-pointer bg-transparent border-none hover:opacity-70"
                >
                  <Trash2 size={18} color="rgba(255, 255, 255, 0.1)" />
                </button>
              </div>

              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                <div
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-emerald-500' : 'bg-white'}`}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  ${goal.currentAmount} saved
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className={`bg-[#1A1A1A] rounded-[48px] p-10 relative border border-white/10 w-full max-w-sm ${highLegibility ? 'border-2 border-white' : ''}`}>
            <button
              onClick={() => setIsAdding(false)}
              className="absolute right-8 top-8 bg-transparent border-none cursor-pointer"
            >
              <X size={24} color="rgba(255, 255, 255, 0.2)" />
            </button>

            <h2 className={`text-3xl font-serif italic text-white mb-8 ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
              New Goal
            </h2>

            <div className="flex flex-col gap-6">
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 block">
                  What are you saving for?
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Shoes"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className={`w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-white placeholder-white/10 outline-none focus:border-white/20 ${highLegibility ? 'border-2 border-white' : ''}`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 block">
                  How much do you need? ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className={`w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-white placeholder-white/10 outline-none focus:border-white/20 ${highLegibility ? 'border-2 border-white' : ''}`}
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full bg-white py-5 rounded-[32px] flex items-center justify-center gap-2 mt-4 cursor-pointer border-none hover:bg-white/90 transition-colors"
              >
                <span className="text-black font-bold">Add Goal</span>
                <CheckCircle2 size={20} color="black" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
