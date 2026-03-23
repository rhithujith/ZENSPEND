import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { CravingMode } from './components/CravingMode';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';

const MainApp: React.FC = () => {
  const { hasCompletedOnboarding, loading } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="flex-1 bg-[#0A0502] flex items-center justify-center min-h-screen relative">
        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: '#064e3b' }} />
        <div className="flex items-center justify-center">
          <span className="text-white/20 font-serif italic text-2xl animate-pulse">
            ZenSpend
          </span>
        </div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0502] relative overflow-hidden">
      {/* Atmosphere background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundColor: '#064e3b' }} />

      <div className="flex-1 relative" key={activeTab}>
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'food' && <CravingMode />}
        {activeTab === 'profile' && <Profile />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
