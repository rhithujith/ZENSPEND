import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Image, Linking, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Star, ShieldCheck, UtensilsCrossed, Pizza, Coffee, RefreshCcw, Heart, DollarSign, X, ExternalLink, Loader2 } from 'lucide-react-native';
import { fetchNearbyRestaurants, RealRestaurant } from '../services/geminiService';
import Geolocation from '@react-native-community/geolocation';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

export const CravingMode: React.FC = () => {
  const { currentBudget, highLegibility } = useApp();
  const [category, setCategory] = useState<'All' | 'Local' | 'Western'>('All');
  const [search, setSearch] = useState('');
  const [filterHealthy, setFilterHealthy] = useState(false);
  const [filterCheap, setFilterCheap] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<RealRestaurant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [restaurants, setRestaurants] = useState<RealRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      setError(null);
      
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await fetchNearbyRestaurants(latitude, longitude);
          setRestaurants(data);
          setLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Please enable location access to see nearby restaurants.");
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    loadRestaurants();
  }, []);

  const isSaveMode = currentBudget < 1000;

  const filteredRestaurants = restaurants.filter(r => {
    const matchesCategory = category === 'All' || r.category.toLowerCase().includes(category.toLowerCase());
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesSaveMode = !isSaveMode || r.isCheap;
    const matchesHealthy = !filterHealthy || r.isHealthy;
    const matchesCheap = !filterCheap || r.isCheap;
    return matchesCategory && matchesSearch && matchesSaveMode && matchesHealthy && matchesCheap;
  });

  const handleRoulette = () => {
    if (filteredRestaurants.length === 0) return;
    setIsSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      setRouletteResult(filteredRestaurants[randomIndex]);
      setIsSpinning(false);
    }, 1500);
  };

  const categories = [
    { id: 'All', label: 'All', icon: UtensilsCrossed },
    { id: 'Local', label: 'Local', icon: Coffee },
    { id: 'Western', label: 'Fast Food', icon: Pizza },
  ];

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
      <View className="space-y-2 mb-8">
        <Text className="text-white/50 font-medium text-sm tracking-widest uppercase">Food</Text>
        <Text className={`text-4xl font-serif italic text-white ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
          What to eat?
        </Text>
      </View>

      {isSaveMode && (
        <View className={`bg-[#1A1A1A] rounded-3xl p-6 flex-row items-center gap-4 border border-emerald-500/30 mb-8 ${highLegibility ? 'border-2 border-emerald-500' : ''}`}>
          <Animated.View entering={FadeIn}>
            <View className="flex-row items-center gap-4">
              <View className="bg-emerald-500/20 p-3 rounded-2xl">
                <ShieldCheck size={32} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-white">Saving Mode</Text>
                <Text className="text-white/40 text-sm">We're showing cheap options to help you save.</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Roulette Trigger */}
      <TouchableOpacity
        onPress={handleRoulette}
        disabled={loading || filteredRestaurants.length === 0}
        className={`bg-white/5 py-6 rounded-[32px] flex-row items-center justify-center gap-3 border border-white/10 mb-8 ${loading || filteredRestaurants.length === 0 ? 'opacity-50' : ''}`}
      >
        <RefreshCcw size={20} color="#fbbf24" className={isSpinning ? 'animate-spin' : ''} />
        <Text className="text-white font-bold tracking-widest uppercase text-xs">Food Roulette</Text>
      </TouchableOpacity>

      {/* Search & Filters */}
      <View className="space-y-4 mb-8">
        <View className="relative">
          <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search color="rgba(255, 255, 255, 0.2)" size={20} />
          </View>
          <TextInput 
            placeholder="Search food..."
            placeholderTextColor="rgba(255, 255, 255, 0.2)"
            value={search}
            onChangeText={setSearch}
            className={`bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white ${highLegibility ? 'border-2 border-white' : ''}`}
          />
        </View>
        
        <View className="flex-row gap-2">
          <TouchableOpacity 
            onPress={() => setFilterHealthy(!filterHealthy)}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${filterHealthy ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5'}`}
          >
            <Heart size={12} color={filterHealthy ? '#10b981' : 'rgba(255, 255, 255, 0.4)'} />
            <Text className={`text-[10px] font-bold uppercase tracking-widest ${filterHealthy ? 'text-emerald-400' : 'text-white/40'}`}>
              Healthy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilterCheap(!filterCheap)}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${filterCheap ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-white/5'}`}
          >
            <DollarSign size={12} color={filterCheap ? '#fbbf24' : 'rgba(255, 255, 255, 0.4)'} />
            <Text className={`text-[10px] font-bold uppercase tracking-widest ${filterCheap ? 'text-amber-400' : 'text-white/40'}`}>
              Cheap
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id as any)}
              className={`flex-row items-center gap-2 px-6 py-3 rounded-2xl mr-3 ${isActive ? 'bg-white' : 'bg-white/5'}`}
            >
              <Icon size={16} color={isActive ? 'black' : 'rgba(255, 255, 255, 0.4)'} />
              <Text className={`font-bold text-xs uppercase tracking-widest ${isActive ? 'text-black' : 'text-white/40'}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Restaurant List */}
      <View className="space-y-4">
        <View className="flex-row justify-between items-center px-1 mb-4">
          <Text className="font-medium text-white/40 text-[10px] uppercase tracking-widest">Nearby Places</Text>
          <Text className="text-[10px] text-white/20 font-bold">
            {loading ? "Searching..." : `${filteredRestaurants.length} found`}
          </Text>
        </View>

        {loading ? (
          <View className="items-center justify-center py-20 space-y-4">
            <ActivityIndicator size="large" color="rgba(255, 255, 255, 0.2)" />
            <Text className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Finding real food...</Text>
          </View>
        ) : error ? (
          <View className="bg-white/5 p-8 rounded-3xl items-center space-y-4">
            <MapPin size={32} color="rgba(244, 63, 94, 0.5)" />
            <Text className="text-white/40 text-sm text-center">{error}</Text>
          </View>
        ) : (
          <View className="gap-3">
            {filteredRestaurants.map((r) => (
              <TouchableOpacity 
                key={r.id}
                onPress={() => Linking.openURL(r.url)}
                className={`bg-white/5 p-3 rounded-[24px] flex-row gap-4 border border-white/5 ${highLegibility ? 'border-2 border-white' : ''}`}
              >
                <View className="w-20 h-20 rounded-xl overflow-hidden bg-white/5">
                  <Image 
                    source={{ uri: `https://picsum.photos/seed/${r.name}/200/200` }} 
                    className="w-full h-full opacity-50"
                  />
                </View>
                <View className="flex-1 justify-center">
                  <View className="flex-row justify-between items-start">
                    <Text className={`font-serif italic text-lg text-white leading-tight ${highLegibility ? 'font-sans not-italic font-bold text-base' : ''}`}>
                      {r.name}
                    </Text>
                    <Text className="text-white/40 font-bold text-[10px]">{r.price}</Text>
                  </View>
                  
                  <View className="flex-row items-center gap-3 mt-1">
                    <View className="flex-row items-center gap-1">
                      <MapPin size={8} color="rgba(255, 255, 255, 0.3)" />
                      <Text className="text-[9px] text-white/30 uppercase tracking-wider">{r.distance}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Star size={8} color="#fbbf24" fill="#fbbf24" />
                      <Text className="text-[9px] text-white/30 uppercase tracking-wider">{r.rating}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 mt-2">
                    {r.isHealthy && (
                      <View className="px-2 py-0.5 bg-emerald-500/10 rounded-md">
                        <Text className="text-[7px] font-bold text-emerald-400 uppercase tracking-widest">Healthy</Text>
                      </View>
                    )}
                    {r.isCheap && (
                      <View className="px-2 py-0.5 bg-amber-500/10 rounded-md">
                        <Text className="text-[7px] font-bold text-amber-400 uppercase tracking-widest">Value</Text>
                      </View>
                    )}
                    <View className="px-2 py-0.5 bg-white/5 rounded-md">
                      <Text className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{r.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Roulette Result Modal */}
      <Modal
        visible={!!rouletteResult}
        transparent
        animationType="fade"
        onRequestClose={() => setRouletteResult(null)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-6">
          <View className="bg-[#1A1A1A] w-full max-w-sm rounded-[48px] p-10 items-center relative border border-white/10">
            <Animated.View entering={FadeIn}>
              <View className="items-center">
                <TouchableOpacity 
                  onPress={() => setRouletteResult(null)}
                  className="absolute right-8 top-8"
                >
                  <X size={24} color="rgba(255, 255, 255, 0.2)" />
                </TouchableOpacity>
                
                <View className="w-48 h-48 rounded-full overflow-hidden mb-8 border-4 border-white/10 shadow-2xl">
                  <Image 
                    source={{ uri: `https://picsum.photos/seed/${rouletteResult?.name}/400/400` }} 
                    className="w-full h-full"
                  />
                </View>
                
                <Text className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-2">The Selection</Text>
                <Text className="text-4xl font-serif italic text-white mb-6 text-center">{rouletteResult?.name}</Text>
                
                <View className="flex-row justify-center gap-6 mb-10">
                  <View className="items-center">
                    <Text className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Rating</Text>
                    <Text className="text-white font-bold">{rouletteResult?.rating}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Distance</Text>
                    <Text className="text-white font-bold">{rouletteResult?.distance}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Price</Text>
                    <Text className="text-white font-bold">{rouletteResult?.price}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  onPress={() => {
                    if (rouletteResult) Linking.openURL(rouletteResult.url);
                    setRouletteResult(null);
                  }}
                  className="w-full bg-white py-5 rounded-[32px] items-center flex-row justify-center gap-2"
                >
                  <Text className="text-black font-bold">View on Maps</Text>
                  <ExternalLink size={18} color="black" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
