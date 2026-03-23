import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { AppProvider, useApp } from './context/AppContext';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { CravingMode } from './components/CravingMode';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const MainApp: React.FC = () => {
  const { hasCompletedOnboarding, highLegibility, loading } = useApp();
  const [activeTab, setActiveTab] = useState('home');
  const tabs = ['home', 'food', 'profile'];

  if (loading) {
    return (
      <View className="flex-1 bg-[#0A0502] items-center justify-center">
        <View className="absolute inset-0 opacity-20" style={{ backgroundColor: '#064e3b' }} />
        <View className="items-center">
          <Animated.View entering={FadeIn.duration(1000)}>
            <Text className="text-white/20 font-serif italic text-2xl">
              ZenSpend
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0502]">
      <View className="flex-1 relative overflow-hidden">
        {/* Atmosphere background */}
        <View className="absolute inset-0 opacity-20" style={{ backgroundColor: '#064e3b' }} />
        
        <View className="flex-1">
          <View key={activeTab} className="flex-1">
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={{ flex: 1 }}
            >
              {activeTab === 'home' && <Dashboard />}
              {activeTab === 'food' && <CravingMode />}
              {activeTab === 'profile' && <Profile />}
            </Animated.View>
          </View>
        </View>
        
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
