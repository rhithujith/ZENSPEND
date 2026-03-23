import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { Plus, Target, Trash2, X, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

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
    <View className="space-y-6">
      <View className="flex-row justify-between items-center px-1">
        <View className="flex-row items-center gap-2">
          <Target size={14} color="rgba(255, 255, 255, 0.6)" />
          <Text className="font-medium text-white/60 text-xs uppercase tracking-widest">
            My Goals
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsAdding(true)}
          className={`w-8 h-8 bg-white/10 rounded-full items-center justify-center ${highLegibility ? 'border-2 border-white' : ''}`}
        >
          <Plus size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View className="gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <View key={goal.id} className={`bg-white/5 p-5 rounded-[32px] border border-white/5 relative ${highLegibility ? 'border-2 border-white' : ''}`}>
              <Animated.View 
                layout={Layout}
                entering={FadeIn}
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                      <Target size={20} color="rgba(255, 255, 255, 0.3)" />
                    </View>
                    <View>
                      <Text className={`font-serif italic text-lg text-white ${highLegibility ? 'font-sans not-italic font-bold text-base' : ''}`}>
                        {goal.title}
                      </Text>
                      <Text className="text-[9px] text-white/30 uppercase tracking-widest">
                        Goal: ${goal.targetAmount.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => deleteGoal(goal.id)}
                    className="p-2"
                  >
                    <Trash2 size={18} color="rgba(255, 255, 255, 0.1)" />
                  </TouchableOpacity>
                </View>

                <View className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                  <View 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-white'}`}
                  />
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    ${goal.currentAmount} saved
                  </Text>
                  <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    {Math.round(progress)}%
                  </Text>
                </View>
              </Animated.View>
            </View>
          );
        })}
      </View>

      <Modal
        visible={isAdding}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAdding(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-black/60 justify-center p-6"
        >
          <View className={`bg-[#1A1A1A] rounded-[48px] p-10 relative border border-white/10 ${highLegibility ? 'border-2 border-white' : ''}`}>
            <Animated.View 
              entering={FadeIn}
              exiting={FadeOut}
            >
              <TouchableOpacity 
                onPress={() => setIsAdding(false)}
                className="absolute right-8 top-8"
              >
                <X size={24} color="rgba(255, 255, 255, 0.2)" />
              </TouchableOpacity>
              
              <Text className={`text-3xl font-serif italic text-white mb-8 ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
                New Goal
              </Text>
              
              <View className="space-y-6">
                <View>
                  <Text className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
                    What are you saving for?
                  </Text>
                  <TextInput 
                    placeholder="e.g. New Shoes"
                    placeholderTextColor="rgba(255, 255, 255, 0.1)"
                    value={newGoal.title}
                    onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
                    className={`bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-white ${highLegibility ? 'border-2 border-white' : ''}`}
                  />
                </View>
                <View>
                  <Text className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
                    How much do you need? ($)
                  </Text>
                  <TextInput 
                    placeholder="0.00"
                    placeholderTextColor="rgba(255, 255, 255, 0.1)"
                    keyboardType="numeric"
                    value={newGoal.targetAmount}
                    onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
                    className={`bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-white ${highLegibility ? 'border-2 border-white' : ''}`}
                  />
                </View>
                <TouchableOpacity 
                  onPress={handleAdd}
                  className="w-full bg-white py-5 rounded-[32px] items-center justify-center flex-row gap-2 mt-4"
                >
                  <Text className="text-black font-bold">Add Goal</Text>
                  <CheckCircle2 size={20} color="black" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};
