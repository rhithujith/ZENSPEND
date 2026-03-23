import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react-native';

const QUESTIONS = [
  "When I get extra cash or see a great sale, I usually spend it immediately instead of waiting a day or two to think it over.",
  "I will join my friends for an outing or trip even if I know it will stretch my current budget.",
  "Looking at my bank account or tracking my monthly spending makes me feel stressed, so I tend to avoid it.",
  "I am comfortable using credit or 'Buy Now, Pay Later' (BNPL) services to get the things I want right away.",
  "I routinely buy small daily treats without worrying about how those little costs add up over the month.",
  "I prioritize putting money into an emergency buffer or a specific savings goal before spending on non-essentials."
];

const { width } = Dimensions.get('window');

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

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress}%`, { duration: 500 }),
    };
  });

  return (
    <View className={cn(
      "flex-1 bg-black items-center justify-center p-6",
      highLegibility && "high-legibility-text"
    )}>
      {/* Background Atmosphere */}
      <View className="absolute inset-0 opacity-40">
        <View className="absolute top-0 left-0 w-full h-full bg-indigo-900/20 blur-3xl rounded-full" />
        <View className="absolute bottom-0 right-0 w-full h-full bg-purple-900/20 blur-3xl rounded-full" />
      </View>
      
      <View className="w-full max-w-md relative z-10">
        <View className="mb-12">
          <View className="flex-row justify-between items-end mb-4 px-2">
            <View>
              <Text className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-1">Onboarding</Text>
              <Text className={cn("text-3xl font-serif italic text-white", highLegibility && "font-sans not-italic font-bold")}>Setup</Text>
            </View>
            <Text className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{currentIndex + 1} / {QUESTIONS.length}</Text>
          </View>
          <View className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <Animated.View 
              style={[{ height: '100%', backgroundColor: 'white' }, progressStyle]}
            />
          </View>
        </View>

        <View key={currentIndex} className={cn("bg-white/5 p-10 rounded-[48px] border border-white/5 min-h-[380px] flex justify-between shadow-2xl", highLegibility && "bg-white/10")}>
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
          >
            <View className="flex justify-between min-h-[300px]">
              <Text className={cn("text-2xl font-serif italic text-white leading-relaxed", highLegibility && "font-sans not-italic font-bold text-xl")}>
                {QUESTIONS[currentIndex]}
              </Text>

              <View className="flex-row flex-wrap gap-4 mt-10">
                {[1, 2, 3, 4].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => handleAnswer(val)}
                    className={cn(
                      "w-[47%] py-5 rounded-2xl border items-center justify-center",
                      answers[currentIndex] === val 
                        ? "bg-white border-white" 
                        : "bg-white/5 border-white/5"
                    )}
                  >
                    <Text className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.2em]",
                      answers[currentIndex] === val ? "text-black" : "text-white/40"
                    )}>
                      {val === 1 ? 'Never' : val === 4 ? 'Always' : val === 2 ? `Sometimes`: 'Mostly'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        </View>

        <View className="flex-row justify-between mt-10 px-2">
          <TouchableOpacity
            disabled={currentIndex === 0}
            onPress={() => setCurrentIndex(currentIndex - 1)}
            className={cn("flex-row items-center gap-2", currentIndex === 0 && "opacity-0")}
          >
            <ChevronLeft size={16} color="rgba(255,255,255,0.2)" />
            <Text className="text-white/20 font-bold text-[10px] uppercase tracking-widest">
              Previous
            </Text>
          </TouchableOpacity>
          
          {currentIndex === QUESTIONS.length - 1 && answers[currentIndex] !== 0 && (
            <TouchableOpacity
              onPress={handleFinish}
              className="bg-white px-10 py-4 rounded-[32px] flex-row items-center gap-2 shadow-xl shadow-white/10"
            >
              <Text className="text-black font-bold">Finish Setup</Text>
              <CheckCircle2 size={18} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
