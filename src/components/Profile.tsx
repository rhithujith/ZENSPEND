import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Switch, Modal } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { Settings, LogOut, ChevronRight, History, Zap, ShieldAlert, UtensilsCrossed, Sparkles } from 'lucide-react-native';
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
    <ScrollView className="flex-1 bg-black p-6" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className={cn("text-3xl font-serif italic text-white", highLegibility && "font-sans not-italic font-bold")}>
          My Profile
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity 
            onPress={toggleLegibility}
            className={cn("w-10 h-10 bg-white/10 rounded-xl items-center justify-center", highLegibility && "bg-white")}
          >
            <Text className={cn("text-xs font-bold text-white/60", highLegibility && "text-black")}>Aa</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center">
            <Settings size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info */}
      <View className="flex-row items-center gap-6 mb-8">
        <View className="w-24 h-24 rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl relative">
          <Image 
            source={{ uri: "https://picsum.photos/seed/alex/200/200" }} 
            className="w-full h-full grayscale"
            style={{ opacity: 0.8 }}
          />
          <View className="absolute inset-0 bg-black/20" />
        </View>
        <View className="flex-1">
          <Text className={cn("text-2xl font-serif italic text-white", highLegibility && "font-sans not-italic font-bold")}>
            {user?.displayName || "Alex Rivera"}
          </Text>
          <View className="flex-row items-center gap-3 mt-2">
            <Text className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Joined 2023</Text>
            <View className="flex-row items-center gap-1.5">
              <View className={cn("w-1.5 h-1.5 rounded-full", isFirebaseActive ? "bg-emerald-500" : "bg-amber-500")} />
              <Text className="text-white/20 text-[8px] font-bold uppercase tracking-widest">
                {isFirebaseActive ? (user?.isAnonymous ? "Guest Mode" : "Cloud Synced") : "Local Mode"}
              </Text>
            </View>
          </View>
          {isFirebaseActive && user?.isAnonymous && (
            <TouchableOpacity
              onPress={loginWithGoogle}
              className="mt-4 flex-row items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"
            >
              <Image source={{ uri: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" }} className="w-3 h-3" />
              <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Sync with Google</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Groq Advice Section */}
      <View className="space-y-4 mb-8">
        <Text className="font-medium text-white/40 text-[10px] uppercase tracking-widest px-1">AI Financial Coach</Text>
        <View className={cn("bg-white/5 p-6 rounded-[32px] border border-white/5 space-y-4", highLegibility && "bg-white/10")}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                <Sparkles size={20} color="white" />
              </View>
              <View>
                <Text className="text-white font-bold text-sm">Groq Intelligence</Text>
                <Text className="text-white/30 text-[10px] uppercase tracking-wider">Llama 3.3 Powered</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleAskGroq}
              disabled={isAsking}
              className={cn("bg-white px-4 py-2 rounded-xl", isAsking && "opacity-50")}
            >
              <Text className="text-black text-[10px] font-bold uppercase tracking-widest">
                {isAsking ? "Thinking..." : "Get Tip"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {advice && (
            <View className="pt-4 border-t border-white/5">
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
              >
                <Text className="text-white/60 text-sm italic leading-relaxed">
                  "{advice}"
                </Text>
              </Animated.View>
            </View>
          )}
        </View>
      </View>

      {/* Money Flow Chart */}
      <View className={cn("bg-white/5 p-8 rounded-[40px] border border-white/5 mb-8", highLegibility && "bg-white/10")}>
        <Text className="font-medium text-white/40 text-[10px] uppercase tracking-widest mb-6">Where my money goes</Text>
        <View className="h-64 w-full items-center justify-center">
          <Svg height="200" width="200" viewBox="0 0 200 200">
            <G rotation="-90" origin="100, 100">
              {data.map((item, index) => {
                const angle = (item.value / total) * 360;
                const x1 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
                const y1 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
                const x2 = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                const y2 = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                const largeArcFlag = angle > 180 ? 1 : 0;
                const d = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                const path = (
                  <Path
                    d={d}
                    fill={item.color}
                    stroke="black"
                    strokeWidth="2"
                  />
                );
                currentAngle += angle;
                return path;
              })}
              <Circle cx="100" cy="100" r="60" fill="black" />
            </G>
          </Svg>
        </View>
        <View className="flex-row justify-between mt-6">
          {data.map((item) => (
            <View key={item.name} className="flex-1 items-center">
              <Text className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">{item.name}</Text>
              <Text className={cn("font-serif italic text-lg text-white", highLegibility && "font-sans not-italic font-bold")}>{item.value}%</Text>
              <View className="w-full h-0.5 rounded-full mt-3" style={{ backgroundColor: item.color, opacity: 0.3 }} />
            </View>
          ))}
        </View>
      </View>

      {/* Dynamic Plan */}
      <View className={cn("bg-white/5 rounded-[32px] p-8 mb-8 relative overflow-hidden border border-white/5", highLegibility && "bg-white/10")}>
        <View className="relative z-10">
          <View className="flex-row items-center gap-3 mb-4">
            <Zap size={18} color="rgba(255,255,255,0.4)" />
            <Text className="font-medium text-xs text-white uppercase tracking-[0.2em]">My Money Plan</Text>
          </View>
          <Text className="text-white/50 text-sm leading-relaxed font-light italic">
            "{plan}"
          </Text>
        </View>
        <View className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
      </View>

      {/* Exam Mode Toggle */}
      <View className={cn("bg-white/5 p-6 rounded-[32px] border border-white/5 flex-row items-center justify-between mb-8", highLegibility && "bg-white/10")}>
        <View className="flex-row items-center gap-5">
          <View className={cn(
            "w-12 h-12 rounded-2xl items-center justify-center",
            isExamModeActive ? "bg-white" : "bg-white/5"
          )}>
            <ShieldAlert size={24} color={isExamModeActive ? "black" : "rgba(255,255,255,0.2)"} />
          </View>
          <View>
            <Text className="font-bold text-white text-sm">Study Mode</Text>
            <Text className="text-[10px] text-white/30 uppercase tracking-widest">Save extra money while studying</Text>
          </View>
        </View>
        <Switch
          value={isExamModeActive}
          onValueChange={(value) => setExamMode(value)}
          trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'white' }}
          thumbColor={isExamModeActive ? 'black' : 'rgba(255,255,255,0.2)'}
        />
      </View>

      {/* Transaction History Accordion */}
      <View className="space-y-4 mb-8">
        <TouchableOpacity 
          onPress={() => setShowHistory(!showHistory)}
          className="flex-row justify-between items-center px-1"
        >
          <View className="flex-row items-center gap-2">
            <History size={14} color="rgba(255,255,255,0.4)" />
            <Text className="font-medium text-white/40 text-[10px] uppercase tracking-widest">
              Recent Spending
            </Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: showHistory ? '90deg' : '0deg' }] }}>
            <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
          </Animated.View>
        </TouchableOpacity>
        
        {showHistory && (
          <View className="space-y-3">
            <Animated.View 
              entering={FadeIn}
              exiting={FadeOut}
              layout={LinearTransition}
            >
              {transactions.map((t) => (
                <View 
                  key={t.id} 
                  className={cn("bg-white/5 p-5 rounded-[32px] flex-row justify-between items-center border border-white/5 mb-3", highLegibility && "bg-white/10")}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                      <UtensilsCrossed size={18} color="rgba(255,255,255,0.2)" />
                    </View>
                    <View>
                      <Text className="font-bold text-white text-sm">{t.title}</Text>
                      <Text className="text-[10px] text-white/30 uppercase tracking-widest">{t.date}</Text>
                    </View>
                  </View>
                  <Text className={cn("font-serif italic text-lg text-white", highLegibility && "font-sans not-italic font-bold")}>-${t.amount}</Text>
                </View>
              ))}
            </Animated.View>
          </View>
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity 
        onPress={logout}
        className="w-full flex-row items-center justify-center gap-3 py-6"
      >
        <LogOut size={18} color="rgba(255,255,255,0.2)" />
        <Text className="text-white/20 font-bold text-[10px] uppercase tracking-[0.3em]">Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
