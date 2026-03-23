import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, PersonalityType, Transaction, Bill, Goal } from '../types';
import { auth, db, isFirebaseConfigured, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInAnonymously, signOut, User, signInWithPopup, linkWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getFinancialAdvice } from '../services/groqService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType extends AppState {
  user: User | null;
  loading: boolean;
  isFirebaseActive: boolean;
  setBudget: (amount: number) => void;
  setSavingAllowance: (amount: number) => void;
  setExamMode: (active: boolean) => void;
  completeOnboarding: () => void;
  addTransaction: (t: Transaction) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  deleteGoal: (id: string) => void;
  smartAdjustBudget: () => Promise<{ message: string; adjusted: boolean }>;
  toggleLegibility: () => void;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  getGroqAdvice: (prompt: string) => Promise<string>;
}

const STORAGE_KEY = 'zenspend_state_v2';

const INITIAL_STATE: AppState = {
  currentBudget: 2500,
  savingAllowance: 345,
  personalityScore: 0,
  personalityType: 'Unknown',
  isExamModeActive: false,
  hasCompletedOnboarding: false,
  transactions: [
    { id: '1', title: 'Grocery Store', amount: 45.50, category: 'Essentials', date: '2024-03-20' },
    { id: '2', title: 'Netflix', amount: 15.99, category: 'Wants', date: '2024-03-19' },
    { id: '3', title: 'Savings', amount: 200.00, category: 'Savings', date: '2024-03-18' },
    { id: '4', title: 'Coffee', amount: 5.50, category: 'Wants', date: '2024-03-17' },
    { id: '5', title: 'Pizza Night', amount: 65.00, category: 'Wants', date: '2024-03-16' },
  ],
  bills: [
    { id: '1', title: 'Rent', amount: 1200, dueDate: '2024-04-01' },
    { id: '2', title: 'Electricity', amount: 85, dueDate: '2024-03-25' },
    { id: '3', title: 'Internet', amount: 60, dueDate: '2024-03-28' },
  ],
  goals: [
    { id: '1', title: 'New MacBook', targetAmount: 3500, currentAmount: 345 },
  ],
  streakCount: 12,
  highLegibility: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  // Load initial state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      if (!isFirebaseConfigured) {
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (saved) {
            setState(JSON.parse(saved));
          }
        } catch (e) {
          console.error("Failed to load local state", e);
        }
      }
      setLoading(false);
    };
    loadState();
  }, []);

  // Handle Auth State
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setState(INITIAL_STATE);
      }
    });
    return unsubscribe;
  }, []);

  // Sync with Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !user || !db) return;

    const docRef = doc(db, 'users', user.uid);
    
    // Initial fetch
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        setState(docSnap.data() as AppState);
      } else {
        // Initialize new user with default state
        setDoc(docRef, INITIAL_STATE).catch(e => console.error("Failed to init user doc", e));
      }
    }).catch(e => {
      console.error("Failed to fetch user doc", e);
    }).finally(() => {
      setLoading(false);
    });

    // Real-time listener
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setState(doc.data() as AppState);
      }
    });

    return unsubscribe;
  }, [user]);

  // Handle Local Storage fallback
  useEffect(() => {
    const saveState = async () => {
      if (!isFirebaseConfigured) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
          console.error("Failed to save local state", e);
        }
      }
    };
    saveState();
  }, [state]);

  // Helper to update State (Local or Firebase)
  const updateState = async (newState: Partial<AppState>) => {
    const updated = { ...state, ...newState };
    
    if (isFirebaseConfigured && user && db) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, updated, { merge: true });
    } else {
      setState(updated);
    }
  };

  const setBudget = (amount: number) => updateState({ currentBudget: amount });
  const setSavingAllowance = (amount: number) => updateState({ savingAllowance: amount });
  const setExamMode = (active: boolean) => updateState({ isExamModeActive: active });
  
  const completeOnboarding = async () => {
    // Always update local state first to ensure UI responsiveness
    setState(prev => ({ ...prev, hasCompletedOnboarding: true }));

    if (isFirebaseConfigured && auth && db) {
      try {
        let currentUser = user;
        if (!currentUser) {
          const credential = await signInAnonymously(auth);
          currentUser = credential.user;
        }
        
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          await setDoc(docRef, { ...state, hasCompletedOnboarding: true }, { merge: true });
        }
      } catch (e) {
        console.error("Firebase onboarding sync failed, continuing in local mode", e);
      }
    }
  };

  const addTransaction = (t: Transaction) => updateState({ transactions: [t, ...state.transactions] });
  const toggleLegibility = () => updateState({ highLegibility: !state.highLegibility });

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      updateState({ hasCompletedOnboarding: false });
    }
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) return;
    try {
      if (user && user.isAnonymous) {
        // Link anonymous account to Google
        await linkWithPopup(user, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (e) {
      console.error("Google sign in failed", e);
    }
  };

  const addGoal = (goalData: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: 0,
    };
    updateState({ goals: [...state.goals, newGoal] });
  };

  const deleteGoal = (id: string) => {
    updateState({ goals: state.goals.filter(g => g.id !== id) });
  };

  const smartAdjustBudget = async () => {
    const totalTarget = state.goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalSaved = state.savingAllowance;
    const gap = totalTarget - totalSaved;

    if (gap <= 0) return { message: "You've reached all your goals! Awesome job.", adjusted: false };

    const recentWants = state.transactions
      .filter(t => t.category === 'Wants')
      .slice(0, 5)
      .reduce((acc, t) => acc + t.amount, 0);

    if (recentWants > 50) {
      const adjustment = Math.min(state.currentBudget * 0.1, recentWants * 0.5);
      const newBudget = state.currentBudget - adjustment;
      const newSavings = state.savingAllowance + adjustment;

      updateState({
        currentBudget: newBudget,
        savingAllowance: newSavings,
      });

      const advice = await getFinancialAdvice(`I just moved $${adjustment.toFixed(2)} from my user's spending budget to their savings because they spent $${recentWants.toFixed(2)} on 'Wants' recently. They are trying to save for goals like ${state.goals.map(g => g.title).join(', ')}. Give them a punchy Gen Z style encouragement about this move.`);

      return { 
        message: advice, 
        adjusted: true 
      };
    }

    return { message: "Your spending looks great! You're on track for your goals.", adjusted: false };
  };

  const getGroqAdvice = async (prompt: string) => {
    return await getFinancialAdvice(prompt);
  };

  return (
    <AppContext.Provider value={{ 
      ...state, 
      user,
      loading,
      isFirebaseActive: isFirebaseConfigured,
      setBudget, 
      setSavingAllowance, 
      setExamMode, 
      completeOnboarding,
      addTransaction,
      addGoal,
      deleteGoal,
      smartAdjustBudget,
      toggleLegibility,
      logout,
      loginWithGoogle,
      getGroqAdvice
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
