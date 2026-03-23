import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Star, ShieldCheck, UtensilsCrossed, Pizza, Coffee, RefreshCcw, Heart, DollarSign, X, ExternalLink } from 'lucide-react';
import { fetchNearbyRestaurants, RealRestaurant } from '../services/geminiService';

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
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const data = await fetchNearbyRestaurants(latitude, longitude);
            setRestaurants(data);
          } catch {
            setError('Failed to fetch restaurants.');
          }
          setLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Please enable location access to see nearby restaurants.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    loadRestaurants();
  }, []);

  const isSaveMode = currentBudget < 1000;

  const filteredRestaurants = restaurants.filter((r) => {
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
    <div className="flex-1 overflow-y-auto p-6 pb-24">
      <div className="space-y-2 mb-8">
        <p className="text-white/50 font-medium text-sm tracking-widest uppercase">Food</p>
        <h1 className={`text-4xl font-serif italic text-white ${highLegibility ? 'font-sans not-italic font-bold' : ''}`}>
          What to eat?
        </h1>
      </div>

      {isSaveMode && (
        <div className={`bg-[#1A1A1A] rounded-3xl p-6 flex items-center gap-4 border border-emerald-500/30 mb-8 ${highLegibility ? 'border-2 border-emerald-500' : ''}`}>
          <div className="bg-emerald-500/20 p-3 rounded-2xl">
            <ShieldCheck size={32} color="#10b981" />
          </div>
          <div>
            <p className="font-bold text-lg text-white">Saving Mode</p>
            <p className="text-white/40 text-sm">We're showing cheap options to help you save.</p>
          </div>
        </div>
      )}

      {/* Roulette Trigger */}
      <button
        onClick={handleRoulette}
        disabled={loading || filteredRestaurants.length === 0}
        className={`w-full bg-white/5 py-6 rounded-[32px] flex items-center justify-center gap-3 border border-white/10 mb-8 cursor-pointer hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <RefreshCcw size={20} color="#fbbf24" className={isSpinning ? 'animate-spin' : ''} />
        <span className="text-white font-bold tracking-widest uppercase text-xs">Food Roulette</span>
      </button>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search color="rgba(255, 255, 255, 0.2)" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none focus:border-white/20 ${highLegibility ? 'border-2 border-white' : ''}`}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterHealthy(!filterHealthy)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-none cursor-pointer transition-colors ${filterHealthy ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5'}`}
          >
            <Heart size={12} color={filterHealthy ? '#10b981' : 'rgba(255, 255, 255, 0.4)'} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${filterHealthy ? 'text-emerald-400' : 'text-white/40'}`}>Healthy</span>
          </button>
          <button
            onClick={() => setFilterCheap(!filterCheap)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-none cursor-pointer transition-colors ${filterCheap ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-white/5'}`}
          >
            <DollarSign size={12} color={filterCheap ? '#fbbf24' : 'rgba(255, 255, 255, 0.4)'} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${filterCheap ? 'text-amber-400' : 'text-white/40'}`}>Cheap</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as 'All' | 'Local' | 'Western')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap cursor-pointer border-none transition-colors ${isActive ? 'bg-white' : 'bg-white/5 hover:bg-white/10'}`}
            >
              <Icon size={16} color={isActive ? 'black' : 'rgba(255, 255, 255, 0.4)'} />
              <span className={`font-bold text-xs uppercase tracking-widest ${isActive ? 'text-black' : 'text-white/40'}`}>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Restaurant List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1 mb-4">
          <span className="font-medium text-white/40 text-[10px] uppercase tracking-widest">Nearby Places</span>
          <span className="text-[10px] text-white/20 font-bold">
            {loading ? 'Searching...' : `${filteredRestaurants.length} found`}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Finding real food...</span>
          </div>
        ) : error ? (
          <div className="bg-white/5 p-8 rounded-3xl flex flex-col items-center gap-4">
            <MapPin size={32} color="rgba(244, 63, 94, 0.5)" />
            <p className="text-white/40 text-sm text-center">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredRestaurants.map((r) => (
              <a
                key={r.id}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white/5 p-3 rounded-[24px] flex gap-4 border border-white/5 hover:bg-white/10 transition-colors no-underline ${highLegibility ? 'border-2 border-white' : ''}`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0">
                  <img
                    src={`https://picsum.photos/seed/${r.name}/200/200`}
                    alt={r.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <p className={`font-serif italic text-lg text-white leading-tight ${highLegibility ? 'font-sans not-italic font-bold text-base' : ''}`}>{r.name}</p>
                    <span className="text-white/40 font-bold text-[10px]">{r.price}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin size={8} color="rgba(255, 255, 255, 0.3)" />
                      <span className="text-[9px] text-white/30 uppercase tracking-wider">{r.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={8} color="#fbbf24" fill="#fbbf24" />
                      <span className="text-[9px] text-white/30 uppercase tracking-wider">{r.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {r.isHealthy && <span className="px-2 py-0.5 bg-emerald-500/10 rounded-md text-[7px] font-bold text-emerald-400 uppercase tracking-widest">Healthy</span>}
                    {r.isCheap && <span className="px-2 py-0.5 bg-amber-500/10 rounded-md text-[7px] font-bold text-amber-400 uppercase tracking-widest">Value</span>}
                    <span className="px-2 py-0.5 bg-white/5 rounded-md text-[7px] font-bold text-white/20 uppercase tracking-widest">{r.category}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Roulette Result Modal */}
      {!!rouletteResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1A1A1A] w-full max-w-sm rounded-[48px] p-10 flex flex-col items-center relative border border-white/10">
            <button
              onClick={() => setRouletteResult(null)}
              className="absolute right-8 top-8 bg-transparent border-none cursor-pointer"
            >
              <X size={24} color="rgba(255, 255, 255, 0.2)" />
            </button>

            <div className="w-48 h-48 rounded-full overflow-hidden mb-8 border-4 border-white/10 shadow-2xl">
              <img
                src={`https://picsum.photos/seed/${rouletteResult.name}/400/400`}
                alt={rouletteResult.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-2">The Selection</p>
            <h2 className="text-4xl font-serif italic text-white mb-6 text-center">{rouletteResult.name}</h2>

            <div className="flex justify-center gap-6 mb-10">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Rating</span>
                <span className="text-white font-bold">{rouletteResult.rating}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Distance</span>
                <span className="text-white font-bold">{rouletteResult.distance}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Price</span>
                <span className="text-white font-bold">{rouletteResult.price}</span>
              </div>
            </div>

            <a
              href={rouletteResult.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setRouletteResult(null)}
              className="w-full bg-white py-5 rounded-[32px] flex items-center justify-center gap-2 no-underline hover:bg-white/90 transition-colors"
            >
              <span className="text-black font-bold">View on Maps</span>
              <ExternalLink size={18} color="black" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
