import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { Wallet, Calendar, Bell, ChevronDown, Sparkles, X, CheckCircle2, Flame, RefreshCcw } from 'lucide-react-native';
import { Goals } from './Goals';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';

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
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-white/50 font-medium text-sm tracking-widest uppercase">My Money</Text>
          <Text className={`text-3xl font-serif italic text-white ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
            Alex Rivera
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <View className={`bg-white/10 px-4 py-2 rounded-2xl flex-row items-center gap-2 border border-amber-400/20 ${highLegibility ? 'border-2 border-amber-400' : ''}`}>
            <Flame size={18} color="#fbbf24" fill="#fbbf24" />
            <Text className="text-amber-400 font-bold">{streakCount}</Text>
          </View>
          <View className={`w-12 h-12 bg-white/10 rounded-2xl items-center justify-center ${highLegibility ? 'border-2 border-white' : ''}`}>
            <Wallet size={24} color="white" />
          </View>
        </View>
      </View>

      {/* Spending Allowance Card */}
      <View className={`bg-[#1A1A1A] rounded-[40px] p-8 relative overflow-hidden border border-white/10 ${highLegibility ? 'border-2 border-white' : ''}`}>
        <Animated.View entering={FadeIn.duration(600)}>
          <View className="z-10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white/40 font-medium tracking-widest uppercase text-[10px]">Daily Budget</Text>
              <View className="bg-white/5 border border-white/10 rounded-full px-2">
                <Picker
                  selectedValue={filter}
                  onValueChange={(itemValue) => setFilter(itemValue)}
                  style={{ height: 40, width: 100, color: 'white' }}
                  dropdownIconColor="white"
                >
                  <Picker.Item label="Day" value="Day" />
                  <Picker.Item label="Week" value="Week" />
                </Picker>
              </View>
            </View>
            <View className="flex-row items-baseline gap-3">
              <Text className={`text-6xl font-light tracking-tighter text-white font-serif italic ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
                ${allowance}
              </Text>
              <Text className="text-white/30 font-medium text-sm">left</Text>
            </View>
            
            <TouchableOpacity 
              onPress={handleSmartAdjust}
              disabled={isAdjusting}
              className="mt-8 flex-row items-center gap-2 bg-white px-6 py-3 rounded-2xl self-start"
            >
              {isAdjusting ? (
                <RefreshCcw size={14} color="black" className="animate-spin" />
              ) : (
                <Sparkles size={14} color="black" />
              )}
              <Text className="text-black text-xs font-bold">
                {isAdjusting ? "Analyzing..." : "Optimize My Budget"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Decorative elements */}
          <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full" />
        </Animated.View>
      </View>

      {/* Goals Section */}
      <View className="mt-8">
        <Goals />
      </View>

      {/* Upcoming Bills */}
      <View className="mt-8 space-y-4">
        <View className="flex-row justify-between items-center px-1">
          <View className="flex-row items-center gap-2">
            <Calendar size={14} color="rgba(255, 255, 255, 0.6)" />
            <Text className="font-medium text-white/60 text-xs uppercase tracking-widest">
              Upcoming Bills
            </Text>
          </View>
          <TouchableOpacity>
            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">View all</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-3">
          {bills.map((bill) => (
            <View 
              key={bill.id} 
              className={`bg-white/5 p-4 rounded-2xl flex-row justify-between items-center border border-white/5 ${highLegibility ? 'border-2 border-white' : ''}`}
            >
              <View className="flex-row items-center gap-4">
                <View className="w-9 h-9 bg-white/5 rounded-lg items-center justify-center">
                  <Bell size={16} color="rgba(255, 255, 255, 0.4)" />
                </View>
                <View>
                  <Text className="font-bold text-white text-xs">{bill.title}</Text>
                  <Text className="text-[9px] text-white/30 uppercase tracking-wider">
                    Due {new Date(bill.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text className={`font-serif italic text-base text-white ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
                ${bill.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Smart Adjustment Result Modal */}
      <Modal
        visible={!!adjustmentResult}
        transparent
        animationType="fade"
        onRequestClose={() => setAdjustmentResult(null)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-4">
          <View className="bg-[#1A1A1A] w-full max-w-sm rounded-[48px] p-10 items-center relative border border-white/10">
            <Animated.View entering={FadeIn}>
              <View className="items-center">
                <TouchableOpacity 
                  onPress={() => setAdjustmentResult(null)}
                  className="absolute right-8 top-8"
                >
                  <X size={24} color="rgba(255, 255, 255, 0.2)" />
                </TouchableOpacity>
                
                <View className={`w-24 h-24 rounded-full items-center justify-center mb-8 ${adjustmentResult?.adjusted ? 'bg-white/10' : 'bg-white/5'}`}>
                  {adjustmentResult?.adjusted ? 
                    <Sparkles size={48} color="white" /> : 
                    <CheckCircle2 size={48} color="rgba(255, 255, 255, 0.2)" />
                  }
                </View>
                
                <Text className="text-3xl font-serif italic text-white mb-4 text-center">
                  {adjustmentResult?.adjusted ? "Portfolio Optimized" : "Peak Efficiency"}
                </Text>
                
                <Text className="text-white/50 mb-10 text-center leading-relaxed text-sm">
                  {adjustmentResult?.message}
                </Text>
                
                <TouchableOpacity 
                  onPress={() => setAdjustmentResult(null)}
                  className="w-full bg-white py-5 rounded-[32px] items-center"
                >
                  <Text className="text-black font-bold">Acknowledge</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </View>
      </Modal>

      {/* Reminder Modal */}
      <Modal
        visible={showReminder}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReminder(false)}
      >
        <View className="flex-1 bg-black/60 justify-end sm:justify-center p-4">
          <View className="bg-[#1A1A1A] w-full max-w-sm rounded-[48px] p-10 items-center self-center border border-white/10">
            <Animated.View entering={SlideInDown}>
              <View className="items-center">
                <View className="w-20 h-20 bg-white/10 rounded-full items-center justify-center mb-8">
                  <Bell size={40} color="white" />
                </View>
                <Text className="text-3xl font-serif italic text-white mb-4 text-center">Obligation Alert</Text>
                <Text className="text-white/50 mb-10 text-center leading-relaxed text-sm">
                  Your rent payment of <Text className="text-white font-bold">$1,200</Text> is due soon. Shall we secure the funds?
                </Text>
                <View className="w-full space-y-4">
                  <TouchableOpacity 
                    onPress={() => setShowReminder(false)}
                    className="w-full bg-white py-5 rounded-[32px] items-center"
                  >
                    <Text className="text-black font-bold">Secure Funds</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setShowReminder(false)}
                    className="w-full items-center py-2"
                  >
                    <Text className="text-white/30 font-bold text-xs uppercase tracking-widest">Defer Notification</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
