import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, Utensils, User } from 'lucide-react-native';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Portfolio', icon: Home },
    { id: 'food', label: 'Cravings', icon: Utensils },
    { id: 'profile', label: 'Identity', icon: User },
  ];

  return (
    <View className="bg-[#1A1A1A] rounded-t-[40px] px-8 pt-4 pb-8 border-t border-white/10 shadow-2xl">
      <View className="flex-row justify-between items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className="items-center gap-1"
              activeOpacity={0.7}
            >
              <View className={`p-2 rounded-2xl ${isActive ? 'bg-white/10' : ''}`}>
                <Icon 
                  size={20} 
                  color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)'} 
                />
              </View>
              <Text className={`text-[8px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-white' : 'text-white/20'}`}>
                {tab.label}
              </Text>
              {isActive && (
                <View className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
