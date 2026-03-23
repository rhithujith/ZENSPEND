import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { CheckCircle2, ChevronLeft } from 'lucide-react';

const QUESTIONS = [
  "When I get extra cash or see a great sale, I usually spend it immediately instead of waiting a day or two to think it over.",
  "I will join my friends for an outing or trip even if I know it will stretch my current budget.",
  "Looking at my bank account or tracking my monthly spending makes me feel stressed, so I tend to avoid it.",
  "I am comfortable using credit or 'Buy Now, Pay Later' (BNPL) services to get the things I want right away.",
  "I routinely buy small daily treats without worrying about how those little costs add up over the month.",
  "I prioritize putting money into an emergency buffer or a specific savings goal before spending on non-essentials."
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding, highLegibility } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(0));

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = () => {
    completeOnboarding();
  };

  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className={cn(
      "min-h-screen bg-black flex items-center justify-center p-6 relative",
      highLegibility && "high-legibility-text"
    )}>
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-indigo-900/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-purple-900/20 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-1">Onboarding</p>
              <h1 className={cn("text-3xl font-serif italic text-white", highLegibility && "font-sans not-italic font-bold")}>Setup</h1>
            </div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{currentIndex + 1} / {QUESTIONS.length}</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div key={currentIndex} className={cn("bg-white/5 p-10 rounded-[48px] border border-white/5 min-h-[380px] flex flex-col justify-between shadow-2xl", highLegibility && "bg-white/10")}>
          <div className="flex flex-col justify-between min-h-[300px]">
            <p className={cn("text-2xl font-serif italic text-white leading-relaxed", highLegibility && "font-sans not-italic font-bold text-xl")}>
              {QUESTIONS[currentIndex]}
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              {[1, 2, 3, 4].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAnswer(val)}
                  className={cn(
                    "w-[47%] py-5 rounded-2xl border flex items-center justify-center cursor-pointer transition-colors",
                    answers[currentIndex] === val
                      ? "bg-white border-white"
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.2em]",
                    answers[currentIndex] === val ? "text-black" : "text-white/40"
                  )}>
                    {val === 1 ? 'Never' : val === 4 ? 'Always' : val === 2 ? 'Sometimes' : 'Mostly'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-10 px-2">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className={cn("flex items-center gap-2 bg-transparent border-none cursor-pointer", currentIndex === 0 && "opacity-0")}
          >
            <ChevronLeft size={16} color="rgba(255,255,255,0.2)" />
            <span className="text-white/20 font-bold text-[10px] uppercase tracking-widest">Previous</span>
          </button>

          {currentIndex === QUESTIONS.length - 1 && answers[currentIndex] !== 0 && (
            <button
              onClick={handleFinish}
              className="bg-white px-10 py-4 rounded-[32px] flex items-center gap-2 shadow-xl cursor-pointer border-none hover:bg-white/90 transition-colors"
            >
              <span className="text-black font-bold">Finish Setup</span>
              <CheckCircle2 size={18} color="black" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
